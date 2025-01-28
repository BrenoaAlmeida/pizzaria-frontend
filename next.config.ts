import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        //protocol:'https', não funciona em localhost
        hostname: 'res.cloudinary.com'
      }
    ]
  }
};

export default nextConfig;
 