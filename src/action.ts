import core from '@actions/core';
import {AppUser} from './app-user.js';

class Action {
  async run(): Promise<void> {
    try {
      const slug = core.getInput('slug', {required: true});
      const token = core.getInput('token', {required: true});

      const {email, username} = await new AppUser().user({slug, token});

      core.setOutput('email', email);
      core.setOutput('username', username);
    } catch (error: unknown) {
      core.setFailed(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }
}

export {Action};
