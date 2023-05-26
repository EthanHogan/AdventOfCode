import { sampleInput } from "./input";

const exampleInput: string = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

const smallExample = `$ cd /`;

// capital "File" is a taken keyword in TS
class file {
  name: string;
  size: number;

  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }
}

class Directory {
  name: string;
  parent: Directory;
  directories: Directory[] = [];
  files: file[] = [];
  size: number = 0;

  constructor(name: string, parentDirectory: Directory) {
    this.name = name;
    this.parent = parentDirectory;
  }

  addFile(newFile: file) {
    this.files.push(newFile);
    this.addNewFileSizeToSelfAndParent(newFile.size);
  }

  addNewFileSizeToSelfAndParent(newFileSize: number) {
    this.size += newFileSize;
    if (this.parent) {
      this.parent.addNewFileSizeToSelfAndParent(newFileSize);
    }
  }
}

type ListFilesCommand = "ls";
type ChangeDirectoryCommand = "cd";
type Command = ListFilesCommand | ChangeDirectoryCommand;

const Commands = {
  ListFiles: "ls" as ListFilesCommand,
  ChangeDirectory: "cd" as ChangeDirectoryCommand,
};

const LineIdentifiers = {
  Command: "$",
  Directory: "dir",
  ParentDirectory: "..",
};

const totalDiskSpace = 70000000;
const diskSpaceNeededForUpdate = 30000000;

function getSmallestDirectoryToDeleteForUpdate(commandStr: string): Number {
  const commandLineLines = commandStr.split("\n");
  let currentDirectory: Directory = null;
  const directories: Directory[] = [];
  // iterate over the command line lines
  for (const cll of commandLineLines) {
    const lineParts = cll.split(" ");
    const lineIdentifier = lineParts[0];
    // if the line starts with a $, it is a command.
    if (lineIdentifier === LineIdentifiers.Command) {
      currentDirectory = processCommandFromCommandLineStr(
        lineParts,
        currentDirectory,
        directories
      );
    } else if (lineIdentifier === LineIdentifiers.Directory) {
      // add new directory as a child of currentDirectory
      const childDirectoryName: string = lineParts[1]; // ["dir", "directoryName"][1] = "directoryName"
      const childDirectory = new Directory(
        childDirectoryName,
        currentDirectory
      );
      currentDirectory.directories.push(childDirectory);
      directories.push(childDirectory);
    } else {
      // must be file line
      const fileSize = parseInt(lineParts[0]);
      const fileName = lineParts[1];
      // add new file as a child of currentDirectory
      const childFile = new file(fileName, fileSize);
      currentDirectory.addFile(childFile);
    }
  }

  // order directories by size
  const dirsOrderedBySize = directories.sort((a, b) => a.size - b.size);
  // get total used space
  const usedDiskSpace = dirsOrderedBySize[dirsOrderedBySize.length - 1].size;
  // get total unused space
  const unusedDiskSpace = totalDiskSpace - usedDiskSpace;
  // get total needed space
  const additionalDiskSpaceNeeded = diskSpaceNeededForUpdate - unusedDiskSpace;

  // loop through the ordered directories until ones size is greater or equal to the needed space
  for (const dir of dirsOrderedBySize) {
    if (dir.size >= additionalDiskSpaceNeeded) return dir.size;
  }

  return null;
}

function processCommandFromCommandLineStr(
  lineParts: string[],
  currentDirectory: Directory,
  directories: Directory[]
): Directory {
  // split the command by spaces. The first index is the $, second is the command, 3rd is the parent directory or child directory
  const command = lineParts[1] as Command; // ls or cd
  // determine which kind of command it is
  if (command === Commands.ChangeDirectory) {
    // if its ChangeDirectory command, then figure out if we are changing to the parent or child
    const parentOrChild = lineParts[2];
    if (parentOrChild === LineIdentifiers.ParentDirectory) {
      // make the parent of currentDirectory the new currentDirectory
      if (currentDirectory.parent) {
        currentDirectory = currentDirectory.parent;
      }
    } else {
      // its a child directory. so create a new Directory object using the name
      const childDirectory = new Directory(parentOrChild, currentDirectory);
      directories.push(childDirectory);

      // check if there is a currentDirectory yet
      if (currentDirectory !== null) {
        // if there is, then add this child directory as a child of the currentDirectory
        currentDirectory.directories.push(childDirectory);
      }
      // always make the child directory the new currentDirectory for change directory commands
      currentDirectory = childDirectory;
    }
  } else {
    // must be a List directory command. I think we can ignore this. the next lines in the next iteration or so will tell us whats in the directory and we can add those to the currentDirectory accordingly
  }
  return currentDirectory;
}

console.log("Answer: ", getSmallestDirectoryToDeleteForUpdate(sampleInput));
