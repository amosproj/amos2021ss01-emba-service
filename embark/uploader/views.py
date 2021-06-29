from http import HTTPStatus

from django import forms
from django.conf import settings

import logging
import os
import time
from http import HTTPStatus
from os import path
import json
import logging

from django.conf import settings
from django.forms import model_to_dict

from django.shortcuts import render
from django import forms
from django.template.loader import get_template
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods

from .archiver import Archiver

from django.http import StreamingHttpResponse
from django.template import loader
from django.forms.models import model_to_dict

# TODO: Add required headers like type of requests allowed later.
# home page test view TODO: change name accordingly
from embark.logreader import LogReader

from uploader.boundedExecutor import BoundedExecutor
from uploader.archiver import Archiver
from uploader.forms import FirmwareForm, DeleteFirmwareForm
from uploader.models import Firmware, FirmwareFile, DeleteFirmware, Result, ResourceTimestamp

logger = logging.getLogger('web')


@csrf_exempt
def login(request):
    html_body = get_template('uploader/login.html')
    return HttpResponse(html_body.render())


@csrf_exempt
@login_required(login_url='/' + settings.LOGIN_URL)
def home(request):
    html_body = get_template('uploader/home.html')
    form = FirmwareForm()
    render(request, 'uploader/fileUpload.html', {'form': form})
    return HttpResponse(html_body.render())


# additional page test view TODO: change name accordingly
def about(request):
    html_body = get_template('uploader/about.html')
    return HttpResponse(html_body.render())


def download_zipped(request, analyze_id):
    """
    download zipped log directory

    :params request: HTTP request
    :params analyze_id: analyzed firmware id

    :return: HttpResponse with zipped log directory on success or HttpResponse including error message
    """

    try:
        firmware = Firmware.objects.get(pk=analyze_id)

        if os.path.exists(firmware.path_to_logs):
            archive_path = Archiver.pack(firmware.path_to_logs, 'zip', firmware.path_to_logs, '.')
            logger.debug(f"Archive {archive_path} created")
            with open(archive_path, 'rb') as requested_log_dir:
                response = HttpResponse(requested_log_dir.read(), content_type="application/zip")
                response['Content-Disposition'] = 'inline; filename=' + archive_path
                return response

        logger.warning(f"Firmware with ID: {analyze_id} does not exist")
        return HttpResponse(f"Firmware with ID: {analyze_id} does not exist")

    except Firmware.DoesNotExist as ex:
        logger.warning(f"Firmware with ID: {analyze_id} does not exist in DB")
        logger.warning(f"{ex}")
        return HttpResponse(f"Firmware with ID: {analyze_id} does not exist in DB")
    except Exception as ex:
        logger.error(f"Error occured while querying for Firmware object with ID: {analyze_id}")
        logger.error(f"{ex}")
        return HttpResponse(f"Error occured while querying for Firmware object with ID: {analyze_id}")


@csrf_exempt
@login_required(login_url='/' + settings.LOGIN_URL)
def start_analysis(request, refreshed):
    """
    View to submit form for flags to run emba with
    if: form is valid
        checks if queue is not full
            starts emba process redirects to uploader page
        else: return Queue full
    else: returns Invalid form error
    Args:
        request:

    Returns:

    """
    # Safely create emba_logs directory

    if request.method == 'POST':
        form = FirmwareForm(request.POST)

        if form.is_valid():
            logger.info("Posted Form is valid")
            form.save()

            # get relevant data
            # TODO: make clean db access
            firmware_file = form.cleaned_data['firmware']
            firmware_flags = Firmware.objects.latest('id')

            # inject into bounded Executor
            if BoundedExecutor.submit_firmware(firmware_flags=firmware_flags, firmware_file=firmware_file):
                if refreshed == 1:
                    return HttpResponseRedirect("../../upload/1/")
                else:
                    return HttpResponseRedirect("../../serviceDashboard/")
            else:
                return HttpResponse("Queue full")
        else:
            logger.error("Posted Form is Invalid")
            logger.error(form.errors)
            return HttpResponse("Invalid Form")

    FirmwareForm.base_fields['firmware'] = forms.ModelChoiceField(queryset=FirmwareFile.objects)
    DeleteFirmwareForm.base_fields['firmware'] = forms.ModelChoiceField(queryset=FirmwareFile.objects)

    analyze_form = FirmwareForm()
    delete_form = DeleteFirmwareForm()

    if refreshed == 1:
        return render(request, 'uploader/fileUpload.html', {'analyze_form': analyze_form, 'delete_form': delete_form})
    else:
        html_body = get_template('uploader/embaServiceDashboard.html')
        return HttpResponse(html_body.render())


@csrf_exempt
@login_required(login_url='/' + settings.LOGIN_URL)
def service_dashboard(request):
    html_body = get_template('uploader/embaServiceDashboard.html')
    return HttpResponse(html_body.render())


def report_dashboard(request):
    """
    delivering ReportDashboard with finished_firmwares as dictionary

    :params request: HTTP request

    :return: rendered ReportDashboard
    """

    finished_firmwares = Firmware.objects.all().filter(finished=True)
    logger.debug(f"firmwares: \n {finished_firmwares}")
    return render(request, 'uploader/reportDashboard.html', {'finished_firmwares': finished_firmwares})


# Function which saves the file .
# request - Post request
@csrf_exempt
@require_http_methods(["POST"])
@login_required(login_url='/' + settings.LOGIN_URL)
def save_file(request, refreshed):
    """
    file saving on POST requests with attached file

    :params request: HTTP request

    :return: HttpResponse including the status
    """

    for file in request.FILES.getlist('file'):
        try:
            is_archive = Archiver.check_extensions(file.name)

            # ensure primary key for file saving exists
            firmware_file = FirmwareFile(is_archive=is_archive)
            firmware_file.save()

            # save file in <media-root>/pk/firmware
            firmware_file.file = file
            firmware_file.save()

#             # not used for now since files get stored in different locations
#             firmware_file = FirmwareFile(file=file)
#             if(path.exists(firmware_file.get_abs_path())):
#                 return HttpResponse("File Exists")
#             else:
#                 firmware_file.save()
#                 return HttpResponse("Firmwares has been successfully saved")
            if is_archive:
                return HttpResponse("Firmwares has been successfully saved")
            else:
                return HttpResponse("Firmware file not supported by archiver (binary file ?). \n"
                                    "Use on your own risk.")

        except Exception as error:
            logger.error(error)
            return HttpResponse("Firmware could not be uploaded")


def log_streamer(request):
    try:
        firmware_id = request.GET.get('id', None)
        from_ = int(request.GET.get('offset', 0))

        if firmware_id is None:
            return False
        try:
            firmware = Firmware.objects.get(id=int(firmware_id))
        except Firmware.DoesNotExist:
            logger.error(f"Firmware with id: {firmware_id}. Does not exist.")
            return False

        file_path = f"/app/emba/{settings.LOG_ROOT}/{firmware.id}/emba.log"
        mtime = os.path.getmtime(file_path)
        with open(file_path) as f:
            start = -int(from_) or -2000
            filestart = True
            while filestart:
                try:
                    f.seek(start, 2)
                    filestart = False
                    result = f.read()
                    last = f.tell()
                    t = loader.get_template('uploader/log.html')
                    yield t.render({"result": result})
                except IOError:
                    start += 50
        reset = 0
        while True:
            newmtime = os.path.getmtime(file_path)
            if newmtime == mtime:
                time.sleep(1)
                reset += 1
                if reset >= 15:
                    yield "<!-- empty -->"
                continue
            mtime = newmtime
            with open(file_path) as f:
                f.seek(last)
                result = f.read()
                if result:
                    t = loader.get_template('uploader/log.html')
                    yield result + "<script>$('html,body').animate(" \
                                   "{ scrollTop: $(document).height() }, 'slow');</script>"
                last = f.tell()
    except Exception as e:
        logger.exception('Wide exception in logstreamer')
        return False


@require_http_methods(["GET"])
def get_logs(request):
    """
    View takes a get request with following params:
    1. id: id for firmware
    2. offset: offset in log file
    Args:
        request: HTTPRequest instance

    Returns:

    """
    generator = log_streamer(request)
    if type(generator) is bool:
        return HttpResponse('Error in Streaming logs')
    response = StreamingHttpResponse(log_streamer(request))
    response['X-Accel-Buffering'] = "no"
    return response


@csrf_exempt
def main_dashboard(request):
    html_body = get_template('uploader/mainDashboard.html')
    return HttpResponse(html_body.render())


@csrf_exempt
def reports(request):
    html_body = get_template('uploader/reports.html')
    return HttpResponse(html_body.render())


@require_http_methods(["POST"])
def delete_file(request):
    """
    file deletion on POST requests with attached present firmware file

    :params request: HTTP request

    :return: HttpResponse including the status
    """

    if request.method == 'POST':
        form = DeleteFirmwareForm(request.POST)

        if form.is_valid():
            logger.info(f"Form {form} is valid")

            # get relevant data
            firmware_file = form.cleaned_data['firmware']
            firmware_file.delete()

            return HttpResponseRedirect("../../home/upload/1/")

        else:
            logger.error(f"Form {form} is invalid")
            logger.error(f"{form.errors}")
            return HttpResponse("invalid Form")

    return HttpResponseRedirect("../../home/upload/1/")


@csrf_exempt
@require_http_methods(["GET"])
def get_load(request):
    try:
        logger.error(f'export load')
        query_set = ResourceTimestamp.objects.all()
        result = {}
        for k in model_to_dict(query_set[0]).keys():
            result[k] = tuple(model_to_dict(d)[k] for d in query_set)
        return JsonResponse(data=result, status=HTTPStatus.OK)
    except ResourceTimestamp.DoesNotExist:
        logger.error(f'ResourceTimestamps not found in database')
        return JsonResponse(data={'error': 'Not Found'}, status=HTTPStatus.NOT_FOUND)

@csrf_exempt
@require_http_methods(["GET"])
def get_result(request):
    try:
        query_ = Result.objects.all()
        result = {}
        for i in model_to_dict(query_[0]).keys():
            result[i] = tuple(model_to_dict(x)[i] for x in query_)
        return JsonResponse(data=result, status=HTTPStatus.OK)
    except Result.DoesNotExist:
        logger.error(f'No Result found in database')
        return JsonResponse(data={'error': 'Not Found'}, status=HTTPStatus.NOT_FOUND)

@csrf_exempt
@require_http_methods(["POST"])
def get_individual_report(request):
    firmware_id = request.GET.get('id', None)
    if not firmware_id:
        logger.error('Bad request for get_individual_report')
        return JsonResponse(data={'error': 'Bad request'}, status=HTTPStatus.BAD_REQUEST)
    try:
        result = Result.objects.get(firmware_id=int(firmware_id))
        return JsonResponse(data=model_to_dict(result), status=HTTPStatus.OK)
    except Result.DoesNotExist:
        logger.error(f'Report for firmware_id: {firmware_id} not found in database')
        return JsonResponse(data={'error': 'Not Found'}, status=HTTPStatus.NOT_FOUND)


# @csrf_exempt
# @require_http_methods(["POST"])
# def get_accumulated_reports(request):
#     results = Result.objects.all()
#     charfields =
#     return HttpResponse(html_body.render())
