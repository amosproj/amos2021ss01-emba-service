import math
import numpy


class kNearestNeighbor(object):

    def __init__(self, k):
        self.__k = k
        self.__mMax = 1e8

    def fit(self, X, y):
        self.__X = X
        self.__y = y
        self.__m = len(X)
        self.__mMax = 1e8

    def predict(self, X):
        m = int(self.__mMax / self.__m)
        numRuns = math.ceil(len(X) / m)
        group = numpy.array([])
        for i in range(numRuns):
            Xs = X[i * m: (i + 1) * m]
            d1 = numpy.square(Xs)
            d1 = d1.sum(axis=1)
            d2 = numpy.square(self.__X)
            d2 = d2.sum(axis=1)
            D = numpy.dot(Xs, self.__X.T)
            D *= -2
            D += d1.reshape(-1, 1)
            D += d2
            ind = numpy.argsort(D, axis=1)[:, 0:self.__k]
            initemp = numpy.zeros(len(ind))
            for j in range(len(ind)):
                row = self.__y[ind[j]]
                dl, repeats = numpy.unique(row, return_counts=True)
                lout = numpy.argmax(repeats)
                initemp[j] = dl[lout]
            group = numpy.append(group,initemp)
        return group