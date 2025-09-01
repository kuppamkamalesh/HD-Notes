// import { Router } from "express";
// import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
// import User from "../models/User";

// const router = Router();

// router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
//   const user = await User.findById(req.user?.id);
//   if (!user)
//     return res.status(404).json({ error: { message: "User not found" } });

//   res.json({
//     id: user.id,
//     email: user.email,
//     name: user.name,
//     dob: user.dob,
//     provider: user.provider,
//   });
// });

// export default router;

import { Router } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import User from "../models/User";

const router = Router();

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user?.id);
  if (!user)
    return res.status(404).json({ error: { message: "User not found" } });

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    dob: user.dob,
    provider: user.provider,
  });
});

export default router;
