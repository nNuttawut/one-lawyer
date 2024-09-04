export const GET_DATA = "GET_DATA";

export const updateData = (data) => {
  console.log(data);
  return {
    type: GET_DATA,
    payload: {
      data: data,
    },
  };
};
