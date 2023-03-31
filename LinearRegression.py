#    Copyright 2016 Stefan Steidl
#    Friedrich-Alexander-Universität Erlangen-Nürnberg
#    Lehrstuhl für Informatik 5 (Mustererkennung)
#    Martensstraße 3, 91058 Erlangen, GERMANY
#    stefan.steidl@fau.de


#    This file is part of the Python Classification Toolbox.
#
#    The Python Classification Toolbox is free software:
#    you can redistribute it and/or modify it under the terms of the
#    GNU General Public License as published by the Free Software Foundation,
#    either version 3 of the License, or (at your option) any later version.
#
#    The Python Classification Toolbox is distributed in the hope that
#    it will be useful, but WITHOUT ANY WARRANTY; without even the implied
#    warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
#    See the GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with the Python Classification Toolbox.
#    If not, see <http://www.gnu.org/licenses/>.


import numpy as np
import scipy.optimize


class LinearRegression(object):

    def __init__(self, lossFunction='l2', lossFunctionParam=0.001, classification=False):
        self.initialized = True
        self.lf = lossFunction
        self.lfp = lossFunctionParam
        self.params = np.zeros(2)

    def fit(self, X, y):
        pV = np.zeros((len(X), 2))
        pV[:, 0] = X
        pV[:, 1] = 1

        if self.lf == 'l2':
            self.params = np.linalg.inv(pV.T.dot(pV)).dot(pV.T.dot(y))
        elif self.lf == 'huber':
            minimum = scipy.optimize.minimize(self.huber_objfunc, self.params, args=(pV, y, self.lfp),
                                          jac=self.huber_objfunc_derivative)
            self.params = minimum.x

    def huber_objfunc(self, params, X, y, a):
        residual = np.matmul(X, params) - y.T
        return self.huber(residual, a)

    def huber_objfunc_derivative(self, params, X, y, a):
        residual = np.matmul(X, params) - y.T
        huber_der = self.huber_derivative(residual, a)
        return np.dot(X.T, huber_der)

    def huber(self, r, a):
        pred = np.square(r)
        pred[abs(r) > a] = a * (2 * abs(r[abs(r) > a]) - a)
        return np.sum(pred)

    def huber_derivative(self, r, a):
        cdr = 2 * r
        cdr[abs(r) > a] = a * 2 * np.sign(r[abs(r) > a])
        return cdr

    def paint(self, qp, featurespace):
        if self.initialized:
            x_min, y_min, x_max, y_max = featurespace.coordinateSystem.getLimits()
            y1 = self.params[0] * x_min + self.params[1]
            x1, y1 = featurespace.coordinateSystem.world2screen(x_min, y1)
            y2 = self.params[0] * x_max + self.params[1]
            x2, y2 = featurespace.coordinateSystem.world2screen(x_max, y2)
            qp.drawLine(x1, y1, x2, y2)

    def predict(self, X):
        return None

