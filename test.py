class Solution(object):
    def checkStraightLine(self, coordinates):
        """
        :type coordinates: List[List[int]]
        :rtype: bool
        """
        x0 = coordinates[0][0]
        y0 = coordinates[0][1]
        x1 = coordinates[1][0]
        y1 = coordinates[1][1]
        coordinates.pop(0)
        coordinates.pop(0)

        if (y1 == y0):
            return self.noDiag(1,y0,coordinates)
        elif (x1 == x0) :
            return self.noDiag(0,x0,coordinates)
        else:
            m = float(y1 - y0 ) / float(x1 - x0)
            b = y1 - (m*x1)
            return self.diagonal(m,b,coordinates)
    
    def noDiag(self,item,val,coordinates):
        for tup in coordinates:
            if tup[item] != val: return False
        return True

    def diagonal(self,m,b,coordinates):
        for tup in coordinates:
            if (m*tup[0]) + b != tup[1]:
                return False
        return True
             
coordinates = [[2,4],[2,5],[2,8]]

A = Solution()
print(A.checkStraightLine(coordinates=coordinates))