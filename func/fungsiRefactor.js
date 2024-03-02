export const refaktorResponeTopup = async (res, findUser) => {
  return res.status(200).json({
    status: 200,
    message: "Sukses",
    data: {
      balance: findUser[0].balance,
    },
  });
};
