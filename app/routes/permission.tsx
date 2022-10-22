// import { Box, Button, Divider, Grid, Typography } from "@mui/material";
// import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
// import { useActionData, useLoaderData } from "@remix-run/react";
// import Permission from "components/permission/Permission";
// import * as Z from "zod";
// import { db } from "~/utils/db.server";
// // import { validationAction } from "~/utils/validation.server";

// const Actions = {
//   create: "create",
//   read: "read",
//   update: "update",
//   delete: "delete",
// } as const;
// const Subjects = {
//   post: "post",
//   comment: "comment",
//   user: "user",
//   permission: "permission",
//   role: "role",
// } as const;
// const schema = Z.object({
//   name: Z.string().min(1, { message: "Name is required" }),
//   description: Z.string(),
//   action: Z.nativeEnum(Actions),
//   subject: Z.nativeEnum(Subjects),
//   conditions: Z.string(),
//   fields: Z.string(),
// });

// export type ActionInput = Z.TypeOf<typeof schema>;

// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();

//   const { formdata, errors } = await validationAction<ActionInput>({
//     formData,
//     schema,
//   });

//   console.log(typeof null);
//   if (errors) {
//     console.log("errors", errors);
//     return json(errors, { status: 400 });
//   }

//   // const permission = await db.permission.create({
//   //   data: formdata,
//   // });

//   return json(null);
// };

// export default function permission() {
//   const error: any = useActionData();

//   console.log(error);
//   return (
//     <Box>
//       <Grid justifyContent="center" container spacing={2}>
//         <Grid
//           mt={5}
//           p={2}
//           borderRadius={2}
//           bgcolor="aliceblue"
//           item
//           xs={10}
//           sm={6}
//         >
//           <Typography textAlign="center" fontWeight="bold">
//             Create Permissions
//           </Typography>
//           <Divider />
//           <Permission error={error}>
//             <Button type="submit" className="button" variant="contained">
//               Submit
//             </Button>
//           </Permission>
//         </Grid>
//       </Grid>
//       <Box display="flex" justifyContent="space-evenly">
//         <Box width={500} textAlign="center"></Box>
//       </Box>
//     </Box>
//   );
// }
