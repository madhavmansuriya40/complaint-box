export const response = (
  successStatus: boolean,
  message: string,
  statusCode: number,
  data?: object
) => {
  return Response.json(
    {
      success: successStatus,
      message: message,
      ...data,
    },
    {
      status: statusCode,
    }
  );
};
