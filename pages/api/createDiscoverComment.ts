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

export default async function createDiscoverComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user, pinId, comment } = JSON.parse(req.body);
  try {
    await client
      .patch(pinId)
      .setIfMissing({ comments: [] })
      .insert("after", "comments[-1]", [
        {
          comment,
          _key: uuidv4(),
          postedBy: { _type: "postedBy", _ref: user._id },
        },
      ])
      .commit();
  } catch (error) {
    return res.status(500).json({ message: `Couldn't save comment`, error });
  }

  res.status(200).json({ message: `Comment saved` });
}
