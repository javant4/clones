import type { NextApiRequest, NextApiResponse } from "next";
import {
  apiVersion,
  dataset,
  projectId,
  useCdn,
  token,
} from "../../sprout_discover_backend/lib/sanity.api";
import sanityClient from "@sanity/client";

const config = {
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token,
};
const client = sanityClient(config);

export default async function uploadPinImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const selectedFile = JSON.parse(req.body);
  try {
    console.log("api ", selectedFile);
    await client.assets.upload("image", selectedFile, {
      contentType: selectedFile.type,
      filename: selectedFile.name,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Couldn't upload pin image`, error });
  }

  res.status(200).json({ message: `Pin image saved` });
}
