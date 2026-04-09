#include <iostream>

int *getDangling()
{
    int local = 42;
    return &local;
}

int main()
{
    int *p = getDangling();

    // 第一次访问 - 可能还是 42
    std::cout << "第一次: " << *p << std::endl;

    // 调用一些函数，复用栈
    std::cout << "调用 std::endl 本身也会使用栈" << std::endl;

    // 第二次访问 - 很可能不再是 42
    std::cout << "第二次: " << *p << std::endl;

    return 0;
}