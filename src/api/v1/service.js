import { postAction, deleteAction } from '@/utils/ajax'

// 添加房间
const getStoreList = ({ headOfficeId, branchIds }) => postAction('/consumer/doorLockSys/queryAllSubbranch', { headOfficeId, branchIds })
const getAllRommType = (headOfficeId) => postAction('/consumer/doorLockSys/queryAllRommType', { headOfficeId })
const addRoom = (rooms) => postAction('/consumer/doorLockSys/addDoorLockRoom', { rooms })
const delAgent = (ids) => deleteAction('/sys/agent/delete', { ids })

export {
  getStoreList,
  addRoom,
  getAllRommType,
  delAgent
}
