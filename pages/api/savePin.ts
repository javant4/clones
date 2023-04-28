import type { NextApiRequest, NextApiResponse } from "next";
import {
  apiVersion,
  dataset,
  projectId,
  useCdn,
  token,
} from "../../sprout_discover_backend/lib/sanity.api";
import sanityClient from "@sanity/client";
import { v4 as uuidv4 } from "uuid";

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
  const { pinId, userId } = JSON.parse(req.body);
  try {
    await client
      .patch(pinId)
      .setIfMissing({ save: [] })
      .insert("after", "save[-1]", [
        {
          _key: uuidv4(),
          userId: userId,
          postedBy: {
            _type: "postedBy",
            _ref: userId,
          },
        },
      ])
      .commit();
  } catch (error) {
    return res.status(500).json({ message: `Couldn't save pin`, error });
  }

  res.status(200).json({ message: `Pin saved` });
}
