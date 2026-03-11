export const sendToken=(user,statusCode,res)=>{
    const token=user.getJWTToken();

   const options = {
    expires: new Date(
      Date.now() + process.env.EXPIRE_COOKIE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,        // 🔥 required for HTTPS (Render)
    sameSite: "None",    // 🔥 required for cross-domain
  };

  res.status(statusCode)
     .cookie("token", token, options)
     .json({
        success: true,
        user,
        token,
     });
};
