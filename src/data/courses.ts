import { Course, Lesson, CodeExample, PracticeProblem } from "@/types/course";

// ============= COURSES DEFINITION =============
export const COURSES: Course[] = [
  {
    id: "js-beginner",
    title: "JavaScript Basics",
    description:
      "Learn JavaScript fundamentals from scratch. Perfect for beginners.",
    language: "javascript",
    level: "beginner",
    chapters: 8,
    duration: "3 weeks",
    color: "from-yellow-400 to-orange-500",
    enabled: true,
  },
  {
    id: "js-intermediate",
    title: "JavaScript Advanced",
    description:
      "Master advanced JavaScript concepts like closures, async/await, and more.",
    language: "javascript",
    level: "intermediate",
    chapters: 10,
    duration: "4 weeks",
    color: "from-orange-400 to-red-500",
    enabled: true,
  },
  {
    id: "python-beginner",
    title: "Python for Beginners",
    description: "Start your Python journey with basics and simple programs.",
    language: "python",
    level: "beginner",
    chapters: 8,
    duration: "3 weeks",
    color: "from-blue-400 to-purple-500",
    enabled: true,
  },
  {
    id: "python-intermediate",
    title: "Python Intermediate",
    description:
      "Explore Python's powerful features: OOP, modules, and data handling.",
    language: "python",
    level: "intermediate",
    chapters: 10,
    duration: "4 weeks",
    color: "from-purple-400 to-pink-500",
    enabled: true,
  },
  {
    id: "c-beginner",
    title: "C Programming Basics",
    description: "Master the fundamentals of C programming language.",
    language: "c",
    level: "beginner",
    chapters: 9,
    duration: "4 weeks",
    color: "from-green-400 to-teal-500",
    enabled: true,
  },
  {
    id: "cpp-beginner",
    title: "C++ Programming Basics",
    description: "Learn C++ from scratch with object-oriented programming.",
    language: "cpp",
    level: "beginner",
    chapters: 10,
    duration: "4 weeks",
    color: "from-red-400 to-pink-500",
    enabled: true,
  },
];

// ============= JAVASCRIPT BEGINNER LESSONS =============
export const JAVASCRIPT_BEGINNER_LESSONS: Lesson[] = [
  {
    id: "js-001",
    courseId: "js-beginner",
    chapter: 1,
    title: "Introduction to JavaScript",
    description: "Learn what JavaScript is and why it's important",
    content: `
# Introduction to JavaScript

JavaScript is a versatile programming language that powers interactive web content. 
It runs in web browsers and can also run on servers using Node.js.

## Why Learn JavaScript?
- **Web Development**: Create interactive websites
- **In-Demand**: One of the most popular programming languages
- **Easy to Start**: Simple syntax, great for beginners
- **Versatile**: Frontend, backend, mobile apps, and more

## Your Learning Journey
In this course, you'll learn:
1. Basic syntax and variables
2. Data types and operations
3. Control flow (if/else, loops)
4. Functions and scope
5. Arrays and objects
6. DOM manipulation
7. Events and interactivity
8. Working with APIs
    `,
    explanation:
      "JavaScript is a programming language that makes websites interactive. You can use it to respond to user clicks, validate forms, and dynamically update web pages.",
    codeExamples: [
      {
        title: "Your First JavaScript Program",
        code: 'console.log("Hello, World!");',
        language: "javascript",
        explanation:
          "This code prints 'Hello, World!' to the console. console.log() is used to display output.",
        output: "Hello, World!",
      },
      {
        title: "Storing a Value",
        code: 'let message = "Welcome to JavaScript!";\nconsole.log(message);',
        language: "javascript",
        explanation:
          "We create a variable 'message' and store text in it. Then we print it.",
        output: "Welcome to JavaScript!",
      },
    ],
    practiceProblems: [
      {
        id: "js-001-p1",
        title: "Print Your Name",
        description:
          "Create a variable with your name and print it using console.log()",
        template: 'let name = "Your Name";\n// Print it here',
        solution: 'let name = "Your Name";\nconsole.log(name);',
        difficulty: "beginner",
        language: "javascript",
      },
    ],
    difficulty: "beginner",
  },
  {
    id: "js-002",
    courseId: "js-beginner",
    chapter: 2,
    title: "Variables and Data Types",
    description: "Understand how to store and work with different types of data",
    content: `
# Variables and Data Types

## What are Variables?
Variables are containers for storing data values. Think of them as labeled boxes where you can put things.

## Creating Variables
JavaScript has three ways to create variables:
- **let**: Modern, block-scoped (use this most of the time)
- **const**: Constant, cannot be changed
- **var**: Old style, function-scoped (avoid in modern JavaScript)

## Data Types
JavaScript has several basic data types:

### String
Text data, enclosed in quotes
\`\`\`javascript
let greeting = "Hello";
\`\`\`

### Number
Integers and decimals
\`\`\`javascript
let age = 25;
let price = 9.99;
\`\`\`

### Boolean
True or false values
\`\`\`javascript
let isStudent = true;
\`\`\`

### Undefined and Null
- undefined: Variable declared but no value assigned
- null: Intentionally empty value
    `,
    explanation:
      "Variables store data. JavaScript has different data types like strings (text), numbers, and booleans (true/false).",
    codeExamples: [
      {
        title: "Creating Variables",
        code: 'let studentName = "Alice";\nlet age = 20;\nlet isActive = true;\n\nconsole.log(studentName);\nconsole.log(age);\nconsole.log(isActive);',
        language: "javascript",
        explanation:
          "We create three variables of different types and print them.",
        output: "Alice\n20\ntrue",
      },
      {
        title: "Using const for Constants",
        code: 'const PI = 3.14159;\nconsole.log(PI);\n// PI = 5; // This would cause an error',
        language: "javascript",
        explanation:
          "const is used for values that won't change. Trying to reassign it causes an error.",
      },
    ],
    practiceProblems: [
      {
        id: "js-002-p1",
        title: "Create Your Profile",
        description:
          "Create variables for your name, age, and whether you're a student",
        template:
          'let name = "Your name";\n// Create age variable\n// Create isStudent variable\n\nconsole.log(name);\nconsole.log(age);\nconsole.log(isStudent);',
        solution:
          'let name = "Your name";\nlet age = 25;\nlet isStudent = true;\n\nconsole.log(name);\nconsole.log(age);\nconsole.log(isStudent);',
        difficulty: "beginner",
        language: "javascript",
      },
    ],
    difficulty: "beginner",
  },
  {
    id: "js-003",
    courseId: "js-beginner",
    chapter: 3,
    title: "Operators and Arithmetic",
    description: "Learn how to perform calculations and comparisons",
    content: `
# Operators and Arithmetic

## Arithmetic Operators
Used for mathematical calculations:
- **+** Addition
- **-** Subtraction
- **\*** Multiplication
- **/** Division
- **%** Modulo (remainder)
- **\*\*** Exponentiation

## Comparison Operators
Compare two values and return true or false:
- **==** Equal to
- **===** Strictly equal to (recommended)
- **!=** Not equal to
- **>** Greater than
- **<** Less than
- **>=** Greater than or equal
- **<=** Less than or equal

## Logical Operators
Combine multiple conditions:
- **&&** AND (both must be true)
- **||** OR (at least one must be true)
- **!** NOT (reverses the value)
    `,
    explanation:
      "Operators let you perform calculations, compare values, and combine conditions.",
    codeExamples: [
      {
        title: "Arithmetic Operations",
        code: 'let a = 10;\nlet b = 3;\n\nconsole.log(a + b);  // 13\nconsole.log(a - b);  // 7\nconsole.log(a * b);  // 30\nconsole.log(a / b);  // 3.333...\nconsole.log(a % b);  // 1',
        language: "javascript",
        explanation: "Basic math operations with numbers",
        output: "13\n7\n30\n3.333...\n1",
      },
      {
        title: "Comparison Operators",
        code: 'let x = 5;\nlet y = 5;\nlet z = "5";\n\nconsole.log(x === y);  // true (same value and type)\nconsole.log(x == z);   // true (same value, different type)\nconsole.log(x === z);  // false (different types)\nconsole.log(x > 3);    // true',
        language: "javascript",
        explanation:
          "=== checks both value and type. == only checks value.",
        output: "true\ntrue\nfalse\ntrue",
      },
    ],
    practiceProblems: [
      {
        id: "js-003-p1",
        title: "Calculate Area of Rectangle",
        description:
          "Create variables for length and width, then calculate and print the area",
        template: "let length = 5;\nlet width = 3;\n// Calculate area\n\nconsole.log(area);",
        solution:
          "let length = 5;\nlet width = 3;\nlet area = length * width;\n\nconsole.log(area);",
        difficulty: "beginner",
        language: "javascript",
      },
    ],
    difficulty: "beginner",
  },
];

// ============= PYTHON BEGINNER LESSONS =============
export const PYTHON_BEGINNER_LESSONS: Lesson[] = [
  {
    id: "py-001",
    courseId: "python-beginner",
    chapter: 1,
    title: "Python Basics",
    description: "Get started with Python programming",
    content: `
# Python Basics

Python is a simple, powerful programming language known for its readable syntax.

## Why Python?
- Easy to learn
- Used in web development, data science, AI
- Great community
- Versatile applications

## Setting Up
- Python runs on Windows, Mac, and Linux
- You can write Python code in any text editor
- Execute with: python filename.py
    `,
    explanation:
      "Python is a beginner-friendly language with clean, readable syntax.",
    codeExamples: [
      {
        title: "Your First Python Program",
        code: 'print("Hello, World!")',
        language: "python",
        explanation: "This prints text to the screen.",
        output: "Hello, World!",
      },
    ],
    practiceProblems: [
      {
        id: "py-001-p1",
        title: "Print a Message",
        description: "Use print() to display your favorite quote",
        template: '# Print your favorite quote here',
        solution: 'print("Keep learning!")',
        difficulty: "beginner",
        language: "python",
      },
    ],
    difficulty: "beginner",
  },
  {
    id: "py-002",
    courseId: "python-beginner",
    chapter: 2,
    title: "Variables and Data Types",
    description: "Work with different types of data in Python",
    content: `
# Variables and Data Types in Python

## Variables
Variables store data values. Python is dynamically typed.

\`\`\`python
name = "Alice"  # String
age = 25        # Integer
height = 5.6    # Float
is_student = True  # Boolean
\`\`\`

## Data Types
- String (str): Text data
- Integer (int): Whole numbers
- Float (float): Decimal numbers
- Boolean (bool): True or False
- List: Collection of items
- Dictionary: Key-value pairs
- Tuple: Immutable list
    `,
    explanation:
      "Variables hold data. Python types are flexible and automatically inferred.",
    codeExamples: [
      {
        title: "Basic Variables",
        code: 'name = "Bob"\nage = 30\nprint(name)\nprint(age)',
        language: "python",
        explanation: "Creating and printing variables",
        output: "Bob\n30",
      },
      {
        title: "Type Checking",
        code: 'x = 5\nprint(type(x))\ny = "hello"\nprint(type(y))',
        language: "python",
        explanation: "Check the type of a variable with type()",
        output: "<class 'int'>\n<class 'str'>",
      },
    ],
    practiceProblems: [
      {
        id: "py-002-p1",
        title: "Create Variables",
        description: "Create variables for name, age, and email, then print them",
        template: '# Create your variables here\n\n# Print them',
        solution: 'name = "John"\nage = 25\nemail = "john@example.com"\nprint(name)\nprint(age)\nprint(email)',
        difficulty: "beginner",
        language: "python",
      },
    ],
    difficulty: "beginner",
  },
  {
    id: "py-003",
    courseId: "python-beginner",
    chapter: 3,
    title: "Control Flow - If Statements",
    description: "Make decisions with if, elif, else",
    content: `
# Control Flow - If Statements

## If Statements
Control the flow of your program based on conditions.

\`\`\`python
if condition:
    # Do something
elif other_condition:
    # Do something else
else:
    # Default action
\`\`\`

## Comparison Operators
- == (equal), != (not equal)
- < (less than), > (greater than)
- <= (less or equal), >= (greater or equal)

## Logical Operators
- and: Both must be true
- or: At least one must be true
- not: Reverses the value
    `,
    explanation:
      "If statements let your program make decisions based on conditions.",
    codeExamples: [
      {
        title: "Simple If Statement",
        code: 'age = 18\nif age >= 18:\n    print("You are an adult")\nelse:\n    print("You are a minor")',
        language: "python",
        explanation: "Check if age is 18 or older",
        output: "You are an adult",
      },
    ],
    practiceProblems: [
      {
        id: "py-003-p1",
        title: "Check Even or Odd",
        description: "Create a program that checks if a number is even or odd",
        template: 'number = 10\n# Write your if-else logic',
        solution: 'number = 10\nif number % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
        difficulty: "beginner",
        language: "python",
      },
    ],
    difficulty: "beginner",
  },
];

// ============= C BEGINNER LESSONS =============
export const C_BEGINNER_LESSONS: Lesson[] = [
  {
    id: "c-001",
    courseId: "c-beginner",
    chapter: 1,
    title: "Introduction to C",
    description: "Start your C programming journey",
    content: `
# Introduction to C

C is a powerful, fundamental programming language used in operating systems, compilers, and embedded systems.

## Why Learn C?
- Understand how computers work at a low level
- Foundation for C++ and other languages
- Used in industry for critical systems
- Teaches good programming practices
    `,
    explanation:
      "C is a foundational programming language that teaches core computer science concepts.",
    codeExamples: [
      {
        title: "Hello World in C",
        code: '#include <stdio.h>\n\nint main() {\n  printf("Hello, World!");\n  return 0;\n}',
        language: "c",
        explanation: "Basic C program structure with includes and main function",
        output: "Hello, World!",
      },
    ],
    practiceProblems: [
      {
        id: "c-001-p1",
        title: "First C Program",
        description: "Create a C program that prints your name",
        template: '#include <stdio.h>\n\nint main() {\n  // Print your name here\n  return 0;\n}',
        solution:
          '#include <stdio.h>\n\nint main() {\n  printf("John Doe");\n  return 0;\n}',
        difficulty: "beginner",
        language: "c",
      },
    ],
    difficulty: "beginner",
  },
];

// ============= C++ BEGINNER LESSONS =============
export const CPP_BEGINNER_LESSONS: Lesson[] = [
  {
    id: "cpp-001",
    courseId: "cpp-beginner",
    chapter: 1,
    title: "C++ Essentials",
    description: "Master C++ fundamentals",
    content: `
# C++ Essentials

C++ is an extension of C with object-oriented programming features.

## Key Features
- Object-oriented programming
- Templates and generics
- Standard library
- High performance
    `,
    explanation: "C++ is powerful and widely used in systems programming.",
    codeExamples: [
      {
        title: "Hello in C++",
        code: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!";\n  return 0;\n}',
        language: "cpp",
        explanation: "C++ program using iostream library",
        output: "Hello, World!",
      },
    ],
    practiceProblems: [
      {
        id: "cpp-001-p1",
        title: "First C++ Program",
        description: "Write a C++ program that greets the user",
        template:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n  // Greet the user here\n  return 0;\n}',
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Welcome to C++!";\n  return 0;\n}',
        difficulty: "beginner",
        language: "cpp",
      },
    ],
    difficulty: "beginner",
  },
];

// ============= EXPORT ALL LESSONS =============
export const LESSONS: Lesson[] = [
  ...JAVASCRIPT_BEGINNER_LESSONS,
  ...PYTHON_BEGINNER_LESSONS,
  ...C_BEGINNER_LESSONS,
  ...CPP_BEGINNER_LESSONS,
];

export function getLessonsByCourse(courseId: string): Lesson[] {
  return LESSONS.filter((lesson) => lesson.courseId === courseId);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === lessonId);
}

export function getCourseById(courseId: string): Course | undefined {
  return COURSES.find((course) => course.id === courseId);
}
