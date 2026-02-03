import moment from 'moment';
import random from 'random';
import jsonfile from 'jsonfile';
import simpleGit from 'simple-git';

const git = simpleGit();
const FILE_PATH = './data.json';

// Pick a random day from the LAST WEEK of the month
const getLastWeekDate = (year, month) => {
  const end = moment(`${year}-${month}-01`).endOf('month');

  // last 7 days window
  const start = end.clone().subtract(6, 'days');

  return moment(
    random.int(start.valueOf(), end.valueOf())
  );
};

const randomTime = (date) => {
  return moment(date)
    .hour(random.int(10, 22))
    .minute(random.int(0, 59))
    .second(random.int(0, 59));
};

const run = async () => {

  for (let m = 1; m <= 12; m++) {

    let date = getLastWeekDate(2025, m);
    date = randomTime(date);

    jsonfile.writeFileSync(FILE_PATH, {
      date: date.format()
    });

    await git.add([FILE_PATH]);

    await git.commit(`monthly ${date.format()}`, {
      "--date": date.format()
    });

    console.log(`✓ ${date.format()}`);
  }

  await git.push('origin', 'main', ['--force']);

  console.log("DONE — 1 commit every last week of each month 2025");
};

run();
