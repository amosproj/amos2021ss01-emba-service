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

try:
    import cvxopt
except Exception:
    import warnings
    warnings.warn("Failed to import cvxopt")


class KernelSVM(object):
    def __init__(self, C=1.0, gamma=0.5):
        self.__c = C
        self.__gamma = gamma
        return None

    def fit(self, X, y):
        y -= np.min(y)
        y /= np.max(y)
        y *= 2
        y -= 1
        length = len(X)
        iden = np.eye(length)
        g = np.concatenate((-1 * iden, iden))
        zeros = np.zeros((length, 1))
        ones = np.ones((length, 1))
        h = np.concatenate((zeros, self.__c * ones))
        K = self.GaussianRBFKernelMatrix(X, X)
        y_sq = np.outer(y, y)
        y_K = y_sq * K
        P = cvxopt.matrix(y_K)
        q = cvxopt.matrix(-ones)
        G = cvxopt.matrix(g)
        H = cvxopt.matrix(h)
        A = cvxopt.matrix(y.reshape(1, -1))
        b = cvxopt.matrix(np.zeros(1))
        sol = cvxopt.solvers.qp(P, q, G, H, A, b)

        lambdas = np.array(sol['x'])
        S = (lambdas > 1e-6).flatten()
        trans = np.transpose(lambdas[S])
        temp = y[S] * trans
        temp_trans = np.transpose(temp)

        k_temp = np.matmul(np.transpose(K[S])[S], temp_trans)
        con_var = np.sum(y[S] - np.ravel(k_temp))
        self.__alpha_0 = 1 / len(y[S]) * con_var

        self.__lambda = lambdas[S]
        self.__vec_y = y[S]
        self.__vec_X = X[S]

        return None

    def GaussianRBFKernelMatrix(self, X1, X2):
        sigma = self.__gamma

        sq_X1 = np.square(X1)
        sum1 = sq_X1.sum(axis=1)
        sq_X2 = np.square(X2)
        sum2 = sq_X2.sum(axis=1)
        xy2 = (np.dot(X1, np.transpose(X2))) * -2
        modsq = xy2 + sum1.reshape(-1, 1) + sum2

        e_term = -modsq * sigma
        K = np.exp(e_term)
        return K

    def predict(self, X, mapping=True):
        K = self.GaussianRBFKernelMatrix(self.__vec_X, X)
        sls = np.transpose(self.__lambda)
        lambda_y = sls * self.__vec_y

        y = np.sign(np.matmul(lambda_y, K) + self.__alpha_0)
        return y