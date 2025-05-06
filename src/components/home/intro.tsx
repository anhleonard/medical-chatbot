import Button from "@/libs/button";
import TextField from "@/libs/text-field";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { openAlert } from "@/redux/slices/alert";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading } from "@/redux/slices/loading";
import { register } from "@/api/services/auth";
import { RegisterDto } from "@/api/dto";

const IntroPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [openView, setOpenView] = useState(false);
  const [openConfirmView, setOpenConfirmView] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Vui lòng nhập tên của bạn")
      .min(2, "Tên phải có ít nhất 2 ký tự"),
    email: Yup.string()
      .required("Vui lòng nhập email của bạn")
      .email("Email không hợp lệ"),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: Yup.string()
      .required("Vui lòng xác nhận mật khẩu")
      .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp"),
    role: Yup.string()
      .required("Vui lòng chọn vai trò")
      .oneOf(['patient', 'doctor'], "Vai trò không hợp lệ"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "patient",
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        dispatch(openLoading());
        const registerData: RegisterDto = {
          name: values.name,
          email: values.email,
          role: values.role as 'patient' | 'doctor',
          password: values.password,
        }
        const response = await register(registerData);
        if (response) {
          dispatch(closeLoading());
          router.replace("/login");
          dispatch(openAlert({
            isOpen: true,
            title: "Thành công",
            subtitle: "Bạn đã đăng ký thành công",
            type: "success",
          }));
        }
      } catch (error) {
        dispatch(openAlert({
          isOpen: true,
          title: "Thất bại",
          subtitle: "Đăng ký thất bại",
          type: "error",
        }));
      } finally {
        dispatch(closeLoading());
      }
    },
  });

  return (
    <div className="h-full p-3 pt-12 xl:py-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 2xl:gap-20 h-full">
        {/* grid column 1 */}
        <div className="h-full w-full flex flex-col justify-center items-center gap-4 xl:pl-36 2xl:pl-40">
          <Image 
            src={"/logo/start-logo.svg"} 
            alt="start-logo" 
            width={0} 
            height={0}
            className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] xl:w-[380px] xl:h-[380px] 2xl:w-[400px] 2xl:h-[400px]"
          />
          <div className="flex flex-col">
            <div className="text-grey-c900 text-base 2xl:text-xl">GIẢI ĐÁP Y KHOA CÙNG</div>
            <div className="font-righteous text-4xl 2xl:text-6xl">
              <span className="text-logo">Medical</span> <span className="text-grey-c900">Chatbot</span>
            </div>
          </div>
        </div>

        {/* grid column 2 */}
        <div className="h-full w-full rounded-2xl bg-primary-c10 flex items-center justify-center p-2 md:p-10 xl:p-4">
          <div className="flex flex-col items-center justify-center gap-4 2xl:gap-16 w-full">
            <div className="gap-4 items-end hidden md:flex">
              <Image src={"/logo/medical-logo.svg"} alt="medical-logo" width={60} height={60}/>
              <div className="font-righteous text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl">
                <span className="text-logo">Medical</span> <span className="text-grey-c900">Chatbot</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl md:rounded-3xl w-full md:w-2/3 xl:w-3/4 px-4 md:px-6 xl:px-10 2xl:px-14 py-6">
              <div className="text-xl 2xl:text-2xl font-bold text-grey-c900 mx-auto mb-6 text-center">Đăng Ký</div>
              <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 w-full">
                <TextField
                  label="Tên"
                  placeholder="Nhập tên của bạn"
                  startIcon={<Image src={"/icons/user-icon.svg"} alt="user-icon" width={20} height={20} />}
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!(formik.touched.name && formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name ? String(formik.errors.name) : undefined}
                />
                <TextField
                  label="Email"
                  placeholder="Nhập email của bạn"
                  startIcon={<Image src={"/icons/email-icon.svg"} alt="email-icon" width={20} height={20} />}
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!(formik.touched.email && formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email ? String(formik.errors.email) : undefined}
                />
                <div className="pl-2">
                  <div className="flex gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="doctor" 
                        checked={formik.values.role === 'doctor'}
                        onChange={formik.handleChange}
                        className="w-4 h-4 accent-primary-c800 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-grey-c900">Bác sĩ</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="patient"
                        checked={formik.values.role === 'patient'}
                        onChange={formik.handleChange}
                        className="w-4 h-4 accent-primary-c800 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-grey-c900">Không phải bác sĩ</span>
                    </label>
                  </div>
                  {formik.touched.role && formik.errors.role && (
                    <div className="text-xs text-red-500">{formik.errors.role}</div>
                  )}
                </div>
                <TextField
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu của bạn"
                  type={openView ? "text" : "password"}
                  startIcon={<Image src={"/icons/password-icon.svg"} alt="password-icon" width={20} height={20} />}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!(formik.touched.password && formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password ? String(formik.errors.password) : undefined}
                  endIcon={
                    <button type="button" onClick={() => setOpenView(!openView)} className="flex justify-center items-center">
                      {openView ? (
                        <Image src={"/icons/view-icon.svg"} alt="view-icon" width={20} height={20} />
                      ) : (
                        <Image src={"/icons/view-off-icon.svg"} alt="view-off-icon" width={20} height={20} />
                      )}
                    </button>
                  }
                />
                <TextField
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập mật khẩu xác nhận"
                  type={openConfirmView ? "text" : "password"}
                  startIcon={<Image src={"/icons/password-icon.svg"} alt="password-icon" width={20} height={20} />}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword ? String(formik.errors.confirmPassword) : undefined}
                  endIcon={
                    <button type="button" onClick={() => setOpenConfirmView(!openConfirmView)} className="flex justify-center items-center">
                      {openConfirmView ? (
                        <Image src={"/icons/view-icon.svg"} alt="view-icon" width={20} height={20} />
                      ) : (
                        <Image src={"/icons/view-off-icon.svg"} alt="view-off-icon" width={20} height={20} />
                      )}
                    </button>
                  }
                />
                <Button type="submit" label="Đăng ký" className="w-full" />
                <div className="text-xs 2xl:text-sm mx-auto text-center">
                  Bạn đã có tài khoản? <span className="text-primary-c800 underline cursor-pointer" onClick={() => router.replace("/login")}>Đăng nhập</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
