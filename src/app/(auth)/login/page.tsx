"use client";
import Button from "@/libs/button";
import TextField from "@/libs/text-field";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "@/api/services/auth";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading } from "@/redux/slices/loading";
import { MainAlert } from "@/components/main-alert";
import { setAccessToken } from "@/storage/storage";
import { openAlert } from "@/redux/slices/alert";
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [openView, setOpenView] = useState(false);

  useEffect(() => {
    router.prefetch("/home");
    router.prefetch("/chat");
  }, [router]);

  const validationSchema = Yup.object({
    email: Yup.string().email("Email không hợp lệ").required("Nhập email của bạn"),
    password: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Nhập mật khẩu của bạn"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        dispatch(openLoading());
        const loginInput = {
          email: values.email,
          password: values.password,
        };
        const result = await login(loginInput);
        if (result) {
          const accessToken = result?.access_token;
          setAccessToken(accessToken);
          router.push("/chat");
        }
      } catch (error) {
        dispatch(
          openAlert({
            isOpen: true,
            title: "Lỗi",
            subtitle: "Đăng nhập thất bại. Vui lòng thử lại.",
            type: "error",
        })); 
      } finally {
        dispatch(closeLoading());
      }
    },
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center w-full bg-primary-c10 py-3 px-4 sm:px-10 md:px-20 lg:px-28 2xl:px-36">
        <button className="flex items-center gap-2">
          <Image src="/logo/medical-logo.svg" alt="medical-logo" width={30} height={30} />
          <div className="font-righteous text-xl md:text-2xl">
            <span className="text-logo">Medical</span> <span className="text-grey-c900">Chatbot</span>
          </div>
        </button>
        <div className="flex justify-center sm:justify-end space-x-12">
          <Button label="Đăng ký" className="px-6 py-2" onClick={() => router.push("/home")} />
        </div>
      </nav>
      {/* Sections */}
      <div className="flex-1">
        <div className="h-full p-4">
          <div className="grid lg:grid-cols-2 gap-8 2xl:gap-20 h-full">
            {/* grid column 1 */}
            <div className="hidden lg:flex h-full w-full flex-col justify-center items-center gap-4 xl:pl-36 2xl:pl-40">
              <Image
                src={"/logo/start-logo.svg"}
                alt="start-logo"
                width={0}
                height={0}
                className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] xl:w-[380px] xl:h-[380px] 2xl:w-[400px] 2xl:h-[400px] animate-scale-in"
              />
              <div className="flex flex-col">
                <div className="text-grey-c900 text-base 2xl:text-xl h-6">
                  <Typewriter words={["CHÀO MỪNG TRỞ LẠI"]} loop={0} />
                </div>
                <div className="font-righteous text-4xl 2xl:text-6xl">
                  <span className="text-logo">Medical</span> <span className="text-grey-c900">Chatbot</span>
                </div>
              </div>
            </div>

            {/* grid column 2 */}
            <div className="h-full w-full rounded-2xl bg-primary-c10 flex items-center justify-center p-4">
              <div className="flex flex-col items-center justify-center gap-8 2xl:gap-16 w-full">
                <div className="flex gap-4 items-end">
                  <Image src={"/logo/medical-logo.svg"} alt="medical-logo" width={60} height={60} />
                  <div className="font-righteous text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl">
                    <span className="text-logo">Medical</span> <span className="text-grey-c900">Chatbot</span>
                  </div>
                </div>
                <div className="bg-white rounded-3xl w-full md:w-2/3 lg:w-3/4 px-4 md:px-6 xl:px-10 2xl:px-14 py-6">
                  <div className="text-xl 2xl:text-2xl font-bold text-grey-c900 mx-auto mb-6 text-center">
                    Đăng Nhập
                  </div>
                  <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 w-full">
                    <TextField
                      label="Email"
                      placeholder="Nhập email của bạn"
                      startIcon={<Image src={"/icons/email-icon.svg"} alt="email-icon" width={20} height={20} />}
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.touched.email && formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email ? String(formik.errors.email) : undefined}
                    />
                    <TextField
                      label="Mật khẩu"
                      placeholder="Nhập mật khẩu của bạn"
                      type={openView ? "text" : "password"}
                      startIcon={<Image src={"/icons/password-icon.svg"} alt="password-icon" width={20} height={20} />}
                      endIcon={
                        <button
                          type="button"
                          onClick={() => setOpenView(!openView)}
                          className="flex justify-center items-center"
                        >
                          {openView ? (
                            <Image src={"/icons/view-icon.svg"} alt="view-icon" width={20} height={20} />
                          ) : (
                            <Image src={"/icons/view-off-icon.svg"} alt="view-off-icon" width={20} height={20} />
                          )}
                        </button>
                      }
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.touched.password && formik.errors.password)}
                      helperText={
                        formik.touched.password && formik.errors.password ? String(formik.errors.password) : undefined
                      }
                    />
                    <Button type="submit" label="Đăng nhập" className="w-full" />
                    <div className="text-xs 2xl:text-sm mx-auto text-center">
                      Bạn chưa có tài khoản?{" "}
                      <span className="text-primary-c800 underline cursor-pointer" onClick={() => router.push("/home")}>
                        Đăng ký
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MainAlert />
    </div>
  );
}
