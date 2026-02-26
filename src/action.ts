import {getInput, setOutput, setFailed} from '@actions/core';
import {AppUser} from './app-user.js';

class Action {
  async run(): Promise<void> {
    try {
      const slug = getInput('slug', {required: true});
      const token = getInput('token', {required: true});

      const {email, username} = await new AppUser().user({slug, token});

      setOutput('email', email);
      setOutput('username', username);
    } catch (error: unknown) {
      setFailed(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }
}

export {Action};
