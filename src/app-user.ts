import {getOctokit} from '@actions/github';
import {type Options, options as schema} from './options.js';

type User = {email: string; username: string};

class AppUser {
  async user(options: Options): Promise<User> {
    const {slug, token} = schema.parse(options);

    const username = `${slug}[bot]`;
    const user = await getOctokit(token).rest.users.getByUsername({username});
    const email = `${user.data.id}+${username}@users.noreply.github.com`;
    return {username, email};
  }
}

export {AppUser, type User};
