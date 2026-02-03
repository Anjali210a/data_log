import moment from 'moment';
import random from 'random';
import jsonfile from 'jsonfile';
import simpleGit from 'simple-git';

const git = simpleGit();
const FILE_PATH = './data.json';

const getCommitCount = (date) => {
  const day = moment(date).day();

  // Friday & Saturday boost
  if (day === 5 || day === 6) {
    return random.int(30, 50);
  }

  return random.int(10, 30);
};

const run = async () => {
  let date = moment('2025-01-01');

  for (let d = 0; d < 365; d++) {

    const commitsToday = getCommitCount(date);

    for (let i = 0; i < commitsToday; i++) {

      const data = { date: date.format() };

      jsonfile.writeFileSync(FILE_PATH, data);

      await git.add([FILE_PATH]);
      await git.commit(`commit ${date.format()}`, {
        "--date": date.format()
      });

      console.log(`✓ ${date.format()} → ${i+1}/${commitsToday}`);
    }

    date = date.add(1, 'day');
  }

  await git.push('origin', 'main', ['--force']);
  console.log("DONE 2025 FILLED");
};

run();
