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

export default async function savePin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pinId } = JSON.parse(req.body);
  try {
    await client.delete(pinId);
  } catch (error) {
    return res.status(500).json({ message: `Couldn't delete pin`, error });
  }

  res.status(200).json({ message: `Pin deleted` });
}
