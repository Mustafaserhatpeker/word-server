import { loginDoctor,registerDoctor } from "../services/doctorService.js";

import { sendResponse } from "../utils/sendResponse.js";
import { catchAsync } from "../utils/catchAsync.js";

export const registerDoctorController = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await registerDoctor(username, password);

  sendResponse(res, 201, user, "Doktor başarıyla kaydedildi.");
}
);
export const loginDoctorController = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await loginDoctor(username, password);

  sendResponse(res, 200, user, "Doktor başarıyla giriş yaptı.");
});