import moment from 'moment';
import random from 'random';
import jsonfile from 'jsonfile';
import simpleGit from 'simple-git';

const git = simpleGit();
const FILE_PATH = './data.json';

// How many active days you want in 2025
const ACTIVE_DAYS = 140;

const randomTime = (date) => {
  return moment(date)
    .hour(random.int(10, 22))
    .minute(random.int(0, 59))
    .second(random.int(0, 59));
};

const run = async () => {

  // Generate all days of 2025
  let days = [];
  let d = moment('2025-01-01');

  for (let i = 0; i < 365; i++) {
    days.push(d.clone());
    d.add(1, 'day');
  }

  // Shuffle days
  days = days.sort(() => Math.random() - 0.5);

  // Pick random subset
  const selected = days.slice(0, ACTIVE_DAYS);

  for (let date of selected) {

    const realDate = randomTime(date);

    jsonfile.writeFileSync(FILE_PATH, {
      date: realDate.format()
    });

    await git.add([FILE_PATH]);

    await git.commit(`commit ${realDate.format()}`, {
      "--date": realDate.format()
    });

    console.log(`✓ ${realDate.format()}`);
  }

  await git.push('origin', 'main', ['--force']);

  console.log("DONE — RANDOM 2025 FILLED");
};

run();
