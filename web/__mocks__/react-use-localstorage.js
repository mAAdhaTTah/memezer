import { useState } from "react";

export default jest
  .fn()
  .mockImplementation((_, initialValue) => useState(initialValue));
