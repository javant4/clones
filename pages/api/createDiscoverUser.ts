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

export default async function createDiscoverUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, _type, userName, image } = JSON.parse(req.body);
  try {
    await client.createIfNotExists({
      _id,
      _type,
      userName,
      image,
    });
  } catch (error) {
    return res.status(500).json({ message: `Couldn't create user`, error });
  }

  res.status(200).json({ message: `User Created` });
}
