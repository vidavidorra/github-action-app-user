import {z} from 'zod';

const schema = z.object({
  token: z.string().regex(/^ghs_[a-zA-Z\d]{36}$/),
  slug: z.string().regex(/^[a-z][a-z-]*$/),
});

type Options = z.infer<typeof schema>;

export {schema, schema as options, type Options};
