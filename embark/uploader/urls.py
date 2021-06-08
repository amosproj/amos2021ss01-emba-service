from django.urls import path
from . import views

# view routing
urlpatterns = [
    path('', views.login, name='embark-login'),
    path('home/', views.home, name='embark-home'),
    path('home/about/', views.about, name='embark-about'),
    path('home/upload/', views.start_analysis, name='embark-start-analysis'),
    path('home/upload/save_file', views.save_file, name='embark-FileSave'),
    path('home/serviceDashboard/', views.serviceDashboard, name='embark-ServiceDashboard'),
    path('home/reportDashboard/', views.reportDashboard, name='embark-ReportDashboard'),
    # debug
    path('progress/', views.progress, name='embark-progress'),
    path('start/', views.start, name='start-test'),
    path('download_zipped/<int:analyze_id>/', views.download_zipped, name='embark-download')

]
