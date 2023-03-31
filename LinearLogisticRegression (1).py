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
import numpy.matlib
import random
import math


class LinearLogisticRegression(object):

    def __init__(self, learningRate=0.5, maxIterations=100):
        self.__rate = learningRate
        self.__maxiter = maxIterations

    def gFunc(self, X, theta):
        return 1 / (1 + np.exp(-(np.inner(theta, X))))

    def fit(self, X, y):
        y -= np.min(y)
        y /= np.max(y)
        t = np.zeros(3)
        c_Grad = np.zeros(3)
        c_Hess = np.zeros((3, 3))
        for i in range(self.__maxiter):
            for j in range(len(X)):
                X_position = np.append(np.asarray(X[j]), 1)
                sigmund = self.gFunc(X_position, t)
                c_Grad += (y[j] - sigmund) * X_position
                p_X_position = np.outer(X_position, np.transpose(X_position))
                c_Hess += sigmund * (1 - sigmund) * p_X_position

            Hessian_inv = np.linalg.inv(-c_Hess)
            t = t - self.__rate * (Hessian_inv.dot(c_Grad))
        self._theta = t

    def predict(self, X):
        Z = np.zeros(len(X))
        for i in range(len(X)):
            X_position = np.append(np.asarray(X[i]), 1)
            val = self.gFunc(X_position, self._theta)
            Z[i] = np.round(val)
        return Z