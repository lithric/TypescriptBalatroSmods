function main(): number[] {
  let bob: number[] = [1, 2, 3, 4];
  delete bob[3];
  return bob;
}

main();
