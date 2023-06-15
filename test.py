class SnapshotArray(object):
    def __init__(self, length):
        """
        :type length: int
        """
        self.aLen = length
        self.lst = [0] * length
        self.snapCounter = 0
        self.snapshots = [{}]

    def set(self, index, val):
        """
        :type index: int
        :type val: int
        :rtype: None
        """
        self.lst[index] = val
        self.snapshots[self.snapCounter][index] = val
        return None

    def snap(self):
        """
        :rtype: int
        """
        self.snapshots.append({})
        self.snapCounter += 1
        return self.snapCounter - 1
        
    def get(self, index, snap_id):
        """
        :type index: int
        :type snap_id: int
        :rtype: int
        """
        resArr = [0] * self.aLen
        for i in range(0 ,snap_id+1):
            for key,value in self.snapshots[i].items():
                resArr[key] = value
        return resArr[index]

snapshotArr = SnapshotArray(3)
snapshotArr.set(1,6)
snapshotArr.snap()
snapshotArr.snap()
snapshotArr.set(1,19)
snapshotArr.set(0,4)
snapshotArr.get(2,1)
snapshotArr.get(2,0)
snapshotArr.get(0,1)
