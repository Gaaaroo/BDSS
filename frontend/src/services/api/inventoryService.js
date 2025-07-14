import React from 'react';
import axiosClient from './axiosClient';
//Cout unit for blood card
export const countBloodUnit = async (type) => {
  try {
    const res = await axiosClient.get('/bloodUnit/countBloodUnit', {
      params: { bloodType: type },
    });
    return res;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
  }
};

export const countRequest = async (type, componentType) => {
  try {
    const res = await axiosClient.get('/receive-form/count-request', {
      params: {
        bloodType: type,
        componentType,
      },
    });
    console.log('count request:', res);
    return res;
  } catch (error) {
    console.error('Failed to count request:', error);
    return 0;
  }
};

// Whole: List all in 1 type : Click card -> change page ->
// Blood Type ----Type -----Volmue ----Owner ------Date Store -------Expiry date ------Status( can update) ----Detail( can view )

export const bloodInventoryByType = async (type) => {
  try {
    const res = await axiosClient.get('bloodUnit/type', {
      params: { bloodType: type },
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log('error when list blood inventory by type', error);
  }
};
// Whole list
// export const listBloodUnits = async (page = 0, size = 10) => {
//   try {
//     const res = await axiosClient.get('bloodUnit', { params: { page, size } });
//     console.log('List bloodUnit', res);
//     return res;
//   } catch (error) {
//     console.error('Error fetching blood units by status:', error);
//   }
// };

// Separate
export const separateBloodUnit = async (bloodId, components) => {
  try {
    const res = await axiosClient.post('bloodComponentUnit', {
      bloodId: bloodId,
      componentTypes: components,
    });
    console.log('Data send: ', res);
    return res;
  } catch (error) {
    console.log('error when separate blood: ', error);
  }
};

// update status after separate
// export const updateBloodStatus = async (status, bloodId) => {
//   try {
//     const res = await axiosClient.post('bloodUnit/updateStatus', null, {
//       params: { status: status, bloodId: bloodId },
//     });
//     console.log('p', params);
//     console.log(res);
//     return res;
//   } catch (error) {
//     console.log('error update after separate', error);
//   }
// };
// After update status + Separate ...........Component page change, status change

//Filter blood units by status + blood type + fullname (Dùng)

////////////////////
export const filterBloodUnits = async ({
  bloodType,
  statuses,
  fullName,
  page = 0,
  size = 10,
}) => {
  try {
    const params = {
      page,
      size,
    };

    if (bloodType) params.bloodType = bloodType;
    if (statuses && statuses.length > 0) params.statuses = statuses;
    if (fullName) params.fullName = fullName;

    console.log('filter params:', params);

    const res = await axiosClient.get('/bloodUnit/filter', { params });
    return res;
  } catch (error) {
    console.error('Error fetching filtered blood units:', error);
    throw error;
  }
};

export const filterBloodComponentUnits = async ({
  bloodType,
  statuses,
  fullName,
  page = 0,
  size = 10,
}) => {
  try {
    const params = {
      page,
      size,
    };

    if (bloodType) params.bloodType = bloodType;
    if (statuses && statuses.length > 0) params.statuses = statuses;
    if (fullName) params.fullName = fullName;

    console.log('filter component params:', params);

    const res = await axiosClient.get('/bloodComponentUnit/filter', { params });
    return res;
  } catch (error) {
    console.error('Error fetching filtered blood component units:', error);
    throw error;
  }
};

///////////////////
// export const bloodUnitByTFS = async (
//   bloodType,
//   statusList,
//   fullName,
//   page = 0,
//   size = 10
// ) => {
//   try {
//     //Kiểm soát serialization, để không bị axios thêm [] vào key
//     const params = new URLSearchParams();
//     statusList.forEach((statuses) => {
//       params.append('statuses', statuses);
//     });
//     params.append('bloodType', bloodType);
//     params.append('fullName', fullName);
//     params.append('page', page);
//     params.append('size', size);

//     const res = await axiosClient.get(
//       'bloodUnit/status-type/searchByFullName',
//       { params }
//     );

//     return res;
//   } catch (error) {
//     console.error('Error when filtering:', error);
//     throw error;
//   }
// };

//Filter blood unit by fullname + status (Dùng)
// export const bloodUnitByFS = async (
//   statusList,
//   fullName,
//   page = 0,
//   size = 10
// ) => {
//   try {
//     //Kiểm soát serialization, để không bị axios thêm [] vào key
//     const params = new URLSearchParams();
//     statusList.forEach((statuses) => {
//       params.append('statuses', statuses);
//     });
//     params.append('fullName', fullName);
//     params.append('page', page);
//     params.append('size', size);

//     const res = await axiosClient.get('bloodUnit/status/searchByFullName', {
//       params,
//     });

//     return res;
//   } catch (error) {
//     console.error('Error when filter blood unit by fullname + status:', error);
//     throw error;
//   }
// };

//Filter blood unit by bloodType + status (Dùng)
// export const bloodUnitByTS = async (
//   bloodType,
//   statusList,
//   page = 0,
//   size = 10
// ) => {
//   try {
//     //Kiểm soát serialization, để không bị axios thêm [] vào key
//     const params = new URLSearchParams();
//     statusList.forEach((statuses) => {
//       params.append('statuses', statuses);
//     });
//     params.append('bloodType', bloodType);
//     params.append('page', page);
//     params.append('size', size);
//     const res = await axiosClient.get('bloodUnit/status-type', {
//       params,
//     });

//     return res;
//   } catch (error) {
//     console.error('Error when filter blood unit by fullname + status:', error);
//     throw error;
//   }
// };
//Status
// export const bloodUnitByS = async (statusList, page = 0, size = 10) => {
//   try {
//     //Kiểm soát serialization, để không bị axios thêm [] vào key
//     const params = new URLSearchParams();
//     statusList.forEach((statuses) => {
//       params.append('statuses', statuses);
//     });
//     params.append('page', page);
//     params.append('size', size);
//     const res = await axiosClient.get('bloodUnit/status', {
//       params,
//     });

//     return res;
//   } catch (error) {
//     console.error('Error when filter blood unit by fullname + status:', error);
//     throw error;
//   }
// };

//Components list => Filter by type of components
//List all component A+
// export const listBloodComponentUnits = async (page = 0, size = 10) => {
//   try {
//     const res = await axiosClient.get('bloodComponentUnit', {
//       params: { page, size },
//     });
//     console.log('List blood components:', res);
//     return res;
//   } catch (error) {
//     console.log('error update after separate', error);
//   }
// };

//List all component by type and status (Dùng)
// export const componentByTS = async (
//   bloodType,
//   statusString,
//   page = 0,
//   size = 10
// ) => {
//   try {
//     const res = await axiosClient.get('bloodComponentUnit/type-status', {
//       params: { bloodType: bloodType, status: statusString, page, size },
//     });
//     console.log('List blood components:', res);
//     return res;
//   } catch (error) {
//     console.log('error update after separate', error);
//   }
// };

// //Filter component by status + fullname (Dùng)
// export const componentByFS = async (
//   statusList,
//   fullName,
//   page = 0,
//   size = 10
// ) => {
//   try {
//     //Kiểm soát serialization, để không bị axios thêm [] vào key
//     const params = new URLSearchParams();
//     statusList.forEach((status) => {
//       params.append('status', status);
//     });
//     params.append('fullName', fullName);
//     params.append('page', page);
//     params.append('size', size);

//     const res = await axiosClient.get(
//       'bloodComponentUnit/status/searchByFullName',
//       { params }
//     );

//     return res;
//   } catch (error) {
//     console.error('Error when filtering:', error);
//     throw error;
//   }
// };

//Filter component by status + blood type + fullname (Dùng)
// export const componentByTFS = async (
//   bloodType,
//   statusList,
//   fullName,
//   page = 0,
//   size = 10
// ) => {
//   try {
//     const params = new URLSearchParams();

//     statusList.forEach((status) => {
//       params.append('status', status);
//     });
//     params.append('bloodType', bloodType);
//     params.append('fullName', fullName);
//     params.append('page', page);
//     params.append('size', size);
//     const res = await axiosClient.get(
//       'bloodComponentUnit/type-status/searchByFullName',
//       { params }
//     );
//     return res;
//   } catch (error) {
//     console.error('Error fetching by type, status and name:', error);
//     throw error;
//   }
// };
//List all component by status (Dùng)
// export const componentByS = async (statusString, page = 0, size = 10) => {
//   try {
//     const res = await axiosClient.get('bloodComponentUnit/status', {
//       params: { status: statusString, page, size },
//     });
//     console.log('List blood components:', res);
//     return res;
//   } catch (error) {
//     console.log('error update after separate', error);
//   }
// };
