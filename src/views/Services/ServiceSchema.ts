import * as Yup from "yup";

export const ServiceSchema = Yup.object().shape({
  connectionName: Yup.string()
    .required("Required")
    .min(2, "must be at least 2 characters")
    .max(100, "must not exceed 100 characters"),
  hostName: Yup.string()
    .required("Required")
    .min(2, "must be at least 2 characters"),
  port: Yup.string()
    .required("Required")
    .matches(/^\d+$/, "Port must be a number"),
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
  securitySSL: Yup.mixed().nullable(),
});

