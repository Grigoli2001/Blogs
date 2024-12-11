export const authRequests = {
  signup: {
    method: "POST",
    url: "/admin/signup",
  },
  login: {
    method: "POST",
    url: "/admin/login",
  },
  logout: {
    method: "GET",
    url: "/admin/logout",
  },
  refreshToken: {
    method: "GET",
    url: "/admin/refresh",
  },
  getMe: {
    method: "GET",
    url: "/admin/me",
  },
  getAdmins: {
    method: "GET",
    url: "/admin/admins",
  },
};

export const blogRequests = {
  createBlog: {
    method: "POST",
    url: "/blog/create",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  },
  editBlog: {
    method: "PUT",
    url: "/blog/",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  },
  toggleBlogStatus: {
    method: "PUT",
    url: "/blog/toggle/",
  },
  getBlogs: {
    method: "GET",
    url: "/admin/blogs",
  },
  getBlogById: {
    method: "GET",
    url: "/blog/",
  },
};

export const adminRequests = {
  getAdmins: {
    method: "GET",
    url: "/admin/admins",
  },
  toggleAdminStatus: {
    method: "PUT",
    url: "/admin/toggle/",
  },
};
