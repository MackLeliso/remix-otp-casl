import { ForbiddenError, subject } from "@casl/ability";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import {
  Box,
  Button,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import authenticator from "~/utils/auth.server";
import { userAbility } from "~/utils/defineAbility.server";
import { db } from "~/utils/db.server";
import { useEffect, useMemo, useState } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  // const auth: {
  //   id: string;
  //   first_name: string;
  //   last_name: string;
  //   phone: string;
  // } = await authenticator.isAuthenticated(request, {
  //   failureRedirect: "/login",
  // });

  // const url = new URL(request.url);
  // console.log(url.searchParams.get("offset"));
  // const limit = Number(url.searchParams.get("limit")) || 2;
  // const test = Number(url.searchParams.get("offset"));

  // const offset = test ? test - 1 : 0;
  // const skip = limit * offset;
  const [posts, count] = await db.$transaction([
    db.post.findMany({
      orderBy: { createdAt: "desc" },
      // skip: skip,
      // take: limit,
    }),
    db.post.count(),
  ]);

  // ForbiddenError.from(await userAbility(auth.id)).throwUnlessCan(
  //   "view",
  //   "post"
  // );

  // const user = (await userAbility(auth.id)).can("read", "user");
  // const post = (await userAbility(auth.id)).can(
  //   "delete",
  //   subject("post", { id: auth.id })
  // );
  // const comment = (await userAbility(auth.id)).can("read", "comment");
  // const role = (await userAbility(auth.id)).can("read", "role");
  // const permission = (await userAbility(auth.id)).can("read", "permission");
  // const permissions = { user, post, role, permission, comment };
  // console.log("permissions", permissions);
  const data = {
    status: 200,
    count: count,
    data: posts,
  };
  // return json({ auth: auth, post: data });
  return json({ auth: null, post: data });
};

export const action: ActionFunction = async ({ request }) => {
  // const auth: {
  //   id: string;
  //   first_name: string;
  //   last_name: string;
  //   phone: string;
  // } = await authenticator.isAuthenticated(request, {
  //   failureRedirect: "/login",
  // });
  // const { title, content } = Object.fromEntries(await request.formData());

  // console.log(auth.id);

  // const post = await db.post.create({
  //   data: {
  //     title: title,
  //     content: content,
  //     authorId: auth.id,
  //   },
  // });

  return json({ auth: null, post: null });
};

export default function post() {
  const { auth, post } = useLoaderData();
  console.log("post", post);
  const { state } = useTransition();
  const busy = state === "submitting";
  const [page, setPage] = useState(2);
  const [limit, setLimit] = useState(2);

  console.log(limit);

  const handleOffset = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleLimit = (event: React.ChangeEvent<unknown>, value: number) => {
    // console.log((window.location.search = `offset=${page}&limit=${value}`));
    setLimit(value);
  };

  useEffect(() => {
    window.location.href = `offset=${page}&limit=${limit}`;
  });
  // const count = Math.ceil(post.count / page);
  return (
    <Box display="flex" justifyContent="space-between">
      <Box flex={7} marginRight={5}>
        {post?.data?.map((post: any) => (
          <Stack
            direction="column"
            spacing={2}
            bgcolor="gray"
            borderRadius={2}
            p={2}
            color="white"
            m={2}
          >
            <Typography>{post.title}</Typography>
            <Typography>{post.content}</Typography>
            <TextField
              id="filled-hidden-label-small"
              placeholder="Comment"
              name="comment"
              size="small"
              color="primary"
            ></TextField>
          </Stack>
        ))}
        <Stack spacing={2}>
          <Typography>Page: {page}</Typography>
          offset
          <Pagination count={post.count} page={page} onChange={handleOffset} />
          limit
          <Pagination count={post.count} page={page} onChange={handleLimit} />
        </Stack>{" "}
      </Box>
      <Box flex={5}>
        <Form method="post">
          <Stack direction="column" spacing={2} p={2}>
            <TextField
              id="filled-hidden-label-small"
              placeholder="title"
              name="title"
              size="small"
              color="primary"
            ></TextField>
            <TextField
              id="filled-hidden-label-small"
              placeholder="content"
              name="content"
              size="small"
              color="primary"
            ></TextField>
            <Button disabled={busy} type="submit" variant="contained">
              {busy ? "Creating..." : "Create"}
            </Button>{" "}
          </Stack>
        </Form>
      </Box>
    </Box>
  );
}
