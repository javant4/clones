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
  const doc = JSON.parse(req.body);
  try {
    await client.create(doc);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Couldn't upload pin image`, error });
  }

  res.status(200).json({ message: `Pin image saved` });
}
