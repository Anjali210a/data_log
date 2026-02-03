import moment from 'moment';
import random from 'random';
import jsonfile from 'jsonfile';
import simpleGit from 'simple-git';

const git = simpleGit();
const FILE_PATH = './data.json';

const randomTime = (date) => {
  return moment(date)
    .hour(random.int(10, 22))
    .minute(random.int(0, 59))
    .second(random.int(0, 59));
};

const run = async () => {

  for (let month = 1; month <= 12; month++) {

    // last day of month
    let end = moment(`2025-${month}-01`).endOf('month');

    // go through last 7 days
    for (let i = 0; i < 7; i++) {

      let date = end.clone().subtract(i, 'days');
      date = randomTime(date);

      jsonfile.writeFileSync(FILE_PATH, {
        date: date.format()
      });

      await git.add([FILE_PATH]);

      await git.commit(`last-week ${date.format()}`, {
        "--date": date.format()
      });

      console.log(`✓ ${date.format()}`);
    }
  }

  await git.push('origin', 'main', ['--force']);

  console.log("DONE — FULL LAST WEEK EVERY MONTH");
};

run();
