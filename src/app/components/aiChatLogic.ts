import { College, collegesData } from "./collegeData";

export interface AIResponse {
  text: string;
  category: "college" | "dsa" | "sql" | "placement" | "unsupported";
}

export function generateAIResponse(query: string): AIResponse {
  const q = query.toLowerCase().trim();

  // 1. CLASSIFY CATEGORIES
  const isCollegeQuery = 
    q.includes("college") || q.includes("university") || q.includes("admission") || 
    q.includes("fees") || q.includes("counseling") || q.includes("counselling") || 
    q.includes("eligibility") || q.includes("placement") || q.includes("package") ||
    q.includes("noida") || q.includes("delhi") || q.includes("meerut") || 
    q.includes("ghaziabad") || q.includes("greater noida") || q.includes("iit") || 
    q.includes("dtu") || q.includes("nsut") || q.includes("iiit") || q.includes("mait") || 
    q.includes("jmi") || q.includes("amity") || q.includes("jss") || q.includes("jiit") || 
    q.includes("galgotias") || q.includes("gl bajaj") || q.includes("sharda") || 
    q.includes("snu") || q.includes("niet") || q.includes("bennett") || q.includes("akgec") || 
    q.includes("kiet") || q.includes("abes") || q.includes("srm") || q.includes("miet") || 
    q.includes("ccsu") || q.includes("subharti") || q.includes("shobhit");

  const isSQLQuery = 
    q.includes("sql") || q.includes("query") || q.includes("database") || 
    q.includes("dbms") || q.includes("select") || q.includes("join") || 
    q.includes("group by") || q.includes("having") || q.includes("table schema") || 
    q.includes("insert") || q.includes("foreign key") || q.includes("normalization") ||
    q.includes("index") || q.includes("transaction") || q.includes("subquery") ||
    q.includes("where vs having") || q.includes("primary key");

  const isDSAQuery = 
    q.includes("dsa") || q.includes("data structure") || q.includes("algorithm") || 
    q.includes("array") || q.includes("linked list") || q.includes("stack") || 
    q.includes("queue") || q.includes("tree") || q.includes("graph") || 
    q.includes("recursion") || q.includes("sorting") || q.includes("search") || 
    q.includes("dynamic programming") || q.includes("dp") || q.includes("binary search") || 
    q.includes("two sum") || q.includes("pointer") || q.includes("complexity") || 
    q.includes("leet") || q.includes("code") || q.includes("debugging") || 
    q.includes("debug") || q.includes("compile") || q.includes("runtime") || 
    q.includes("time complexity") || q.includes("space complexity") || 
    q.includes("missing number") || q.includes("reverse") || q.includes("loop") ||
    q.includes("vector") || q.includes("hash") || q.includes("map");

  const isPlacementQuery = 
    q.includes("placement") || q.includes("interview") || q.includes("resume") || 
    q.includes("roadmap") || q.includes("career") || q.includes("sde") || 
    q.includes("amazon") || q.includes("google") || q.includes("microsoft") || 
    q.includes("tcs") || q.includes("infosys") || q.includes("wipro") || 
    q.includes("star method") || q.includes("behavioral") || q.includes("accenture") ||
    q.includes("mock") || q.includes("operating system") || q.includes("computer network") ||
    q.includes("system design") || q.includes("osi layer") || q.includes("deadlock") || 
    q.includes("web dev") || q.includes("react") || q.includes("html") || q.includes("css") ||
    q.includes("javascript") || q.includes("python") || q.includes("java") || q.includes("c++");

  // 2. GENERATE RESPONSE BASED ON CLASS

  // --- A. COLLEGE SELECTION & COUNSELING ---
  if (isCollegeQuery) {
    // Check if it's a comparison query between specific colleges
    const matchedColleges = collegesData.filter(c => 
      q.includes(c.shortName.toLowerCase()) || 
      q.includes(c.name.toLowerCase()) ||
      (c.shortName.toLowerCase() === "gl bajaj" && q.includes("gl bajaj")) ||
      (c.shortName.toLowerCase() === "amity noida" && q.includes("amity")) ||
      (c.shortName.toLowerCase() === "jss noida" && q.includes("jss")) ||
      (c.shortName.toLowerCase() === "jiit noida" && q.includes("jiit")) ||
      (c.shortName.toLowerCase() === "galgotias univ." && q.includes("galgotias")) ||
      (c.shortName.toLowerCase() === "sharda univ." && q.includes("sharda")) ||
      (c.shortName.toLowerCase() === "snu greater noida" && q.includes("snu")) ||
      (c.shortName.toLowerCase() === "srm ghaziabad" && q.includes("srm")) ||
      (c.shortName.toLowerCase() === "miet meerut" && q.includes("miet"))
    );

    if (matchedColleges.length >= 2) {
      // Comparison layout
      let reply = `### 🏛️ College Comparison Report\n\nI found the details for the colleges you want to compare. Here is a side-by-side comparison:\n\n`;
      reply += `| Feature | ${matchedColleges.map(c => `**${c.shortName}**`).join(" | ")} |\n`;
      reply += `| --- | ${matchedColleges.map(() => "---").join(" | ")} |\n`;
      reply += `| **Location** | ${matchedColleges.map(c => c.location).join(" | ")} |\n`;
      reply += `| **Average Package** | ${matchedColleges.map(c => `**${c.avgPackage}**`).join(" | ")} |\n`;
      reply += `| **Highest Package** | ${matchedColleges.map(c => c.highestPackage).join(" | ")} |\n`;
      reply += `| **B.Tech CSE Fee** | ${matchedColleges.map(c => c.fees["B.Tech CSE"] || "N/A").join(" | ")} |\n`;
      reply += `| **MCA Fee** | ${matchedColleges.map(c => c.fees["MCA"] || "N/A").join(" | ")} |\n`;
      reply += `| **Eligibility** | ${matchedColleges.map(c => c.eligibility).join(" | ")} |\n`;
      reply += `| **Key Recruiters** | ${matchedColleges.map(c => c.recruiters.slice(0, 3).join(", ") + "...").join(" | ")} |\n\n`;

      reply += `#### Key Differences & ROI Recommendation:\n`;
      matchedColleges.forEach(c => {
        reply += `- **${c.shortName}**: ${c.description} Key strength: ${c.highlights[0]}.\n`;
      });
      return { text: reply, category: "college" };
    }

    // Check location filters
    let locFilter: string[] = [];
    if (q.includes("greater noida")) locFilter.push("Greater Noida");
    else if (q.includes("noida")) locFilter.push("Noida"); // "Greater Noida" contains "noida", so we do else-if or handle carefully
    if (q.includes("delhi")) locFilter.push("Delhi");
    if (q.includes("ghaziabad")) locFilter.push("Ghaziabad");
    if (q.includes("meerut")) locFilter.push("Meerut");

    // Check course filters
    let courseFilter: string | null = null;
    if (q.includes("b.tech") || q.includes("btech") || q.includes("engineering")) courseFilter = "B.Tech CSE";
    else if (q.includes("mca")) courseFilter = "MCA";
    else if (q.includes("bca")) courseFilter = "BCA";
    else if (q.includes("mba")) courseFilter = "MBA";
    else if (q.includes("bba")) courseFilter = "BBA";

    // Check budget filters
    let maxBudget = 9999999;
    if (q.includes("under 1l") || q.includes("under 1 lakh") || q.includes("below 1l")) maxBudget = 100000;
    else if (q.includes("under 1.5") || q.includes("under 1.5l") || q.includes("below 1.5")) maxBudget = 150000;
    else if (q.includes("under 2l") || q.includes("under 2 lakh") || q.includes("below 2")) maxBudget = 200000;
    else if (q.includes("under 3l") || q.includes("under 3 lakh") || q.includes("below 3")) maxBudget = 300000;
    else if (q.includes("affordable") || q.includes("cheap") || q.includes("low fee")) maxBudget = 150000;

    // Filter data
    let filtered = collegesData;
    if (locFilter.length > 0) {
      filtered = filtered.filter(c => locFilter.includes(c.location));
    }
    if (courseFilter) {
      filtered = filtered.filter(c => c.courses.includes(courseFilter!));
    }
    if (maxBudget < 9999999) {
      filtered = filtered.filter(c => {
        const feeStr = c.fees[courseFilter || "B.Tech CSE"] || Object.values(c.fees)[0];
        if (!feeStr) return true;
        // Parse fee value: e.g. "₹1.4L/year" -> 140000, "₹40,000/year" -> 40000
        const cleanFee = feeStr.replace(/[^0-9.kKlL]/g, "");
        let feeNum = 0;
        if (cleanFee.includes("L") || cleanFee.includes("l")) {
          feeNum = parseFloat(cleanFee) * 100000;
        } else if (cleanFee.includes("K") || cleanFee.includes("k")) {
          feeNum = parseFloat(cleanFee) * 1000;
        } else {
          feeNum = parseInt(cleanFee, 10) || 0;
        }
        return feeNum <= maxBudget;
      });
    }

    if (filtered.length > 0) {
      let reply = `### 🎓 Matching Colleges in Noida/Meerut/Delhi/Ghaziabad/Greater Noida\n\nBased on your query, I found **${filtered.length}** colleges matching your criteria:\n\n`;
      reply += `| College Name | Location | Fees (${courseFilter || "B.Tech CSE"}) | Avg Package | Eligibility |\n`;
      reply += `| --- | --- | --- | --- | --- |\n`;
      filtered.forEach(c => {
        const fee = c.fees[courseFilter || "B.Tech CSE"] || Object.values(c.fees)[0] || "N/A";
        reply += `| [${c.shortName}](${c.name}) | **${c.location}** | ${fee} | **${c.avgPackage}** | ${c.eligibility.split("+")[0]} |\n`;
      });
      reply += `\n\n`;

      reply += `#### 🌟 Detailed Highlights of Top Matches:\n`;
      filtered.slice(0, 3).forEach(c => {
        reply += `**${c.name} (${c.location})**:\n`;
        reply += `- **Placements**: Avg package **${c.avgPackage}**, highest **${c.highestPackage}**.\n`;
        reply += `- **Recruiters**: ${c.recruiters.join(", ")}.\n`;
        reply += `- **Key Highlights**: ${c.highlights.join(" | ")}.\n\n`;
      });

      return { text: reply, category: "college" };
    } else {
      return {
        text: `I couldn't find colleges that strictly match all your filters (Location: ${locFilter.join(", ") || "All"}, Course: ${courseFilter || "All"}, Budget: ${maxBudget === 9999999 ? "Any" : "Under ₹" + maxBudget}).\n\nHowever, here are the top colleges in Delhi NCR from our database:\n\n` + 
          collegesData.slice(0, 5).map(c => `- **${c.name}** in **${c.location}** (CSE Fee: ${c.fees["B.Tech CSE"] || "N/A"}, Avg Package: ${c.avgPackage})`).join("\n") +
          `\n\nTry broadening your search budget or locations!`,
        category: "college"
      };
    }
  }

  // --- B. DATA STRUCTURES & ALGORITHMS (DSA) ---
  if (isDSAQuery) {
    // If user asks to debug
    if (q.includes("debug") || q.includes("fix") || q.includes("error") || q.includes("segmentation") || q.includes("bounds")) {
      // Find out if they passed custom code
      const hasCode = query.includes("{") || query.includes("for") || query.includes("int ") || query.includes("def ");
      if (hasCode) {
        return {
          text: `### 🛠️ Code Debugger & Optimizer\n\nI reviewed your code. Here is the analysis and the fix:\n\n**Common Issue Found:**\n- **Array Index Out of Bounds / Off-by-One error**: In C++/Java arrays, index ranges from \`0\` to \`n-1\`. Using \`i <= n\` inside a loop causes memory access violation (segmentation fault) or undefined behavior.\n- **Inefficient Time Complexity**: Redundant loops can be optimized using a HashMap or two-pointers.\n\nHere is the corrected and optimized code:\n\n\`\`\`cpp\n// Corrected C++ Implementation\n#include <iostream>\n#include <vector>\n\nvoid solve(std::vector<int>& arr) {\n    int n = arr.size();\n    // FIX: Changed condition from i <= n to i < n to prevent out of bounds error\n    for (int i = 0; i < n; i++) {\n        arr[i] = i * 2; \n        std::cout << arr[i] << " ";\n    }\n    std::cout << std::endl;\n}\n\`\`\`\n\n**Key Optimizations Applied:**\n1. **Fixed Loop boundary**: Restructured to \`i < n\` instead of \`i <= n\`.\n2. **Pass by reference**: Passed \`vector\` by reference (\`&\`) to prevent making copies, saving memory and time (\`O(1)\` copy overhead vs \`O(N)\`).`,
          category: "dsa"
        };
      } else {
        return {
          text: `### 🛠️ DSA Debugging Guide\n\nTo help you debug, please paste your code along with the compiler error or problem statement! \n\n**Common Debugging Checklist:**\n1. **Segmentation Fault**: Check if you are accessing \`arr[n]\` on an array of size \`n\`, or dereferencing \`NULL\` in Linked Lists/Trees (\`node->next\` when \`node\` is null).\n2. **Time Limit Exceeded (TLE)**: Look for nested loops giving \`O(N^2)\` complexity. Try to optimize using sorting, HashMaps, dynamic programming, or two-pointers.\n3. **Incorrect Output**: Verify base cases in recursion, and watch out for integer overflow on large inputs (use \`long long\` in C++ or \`BigInt\` in JS).`,
          category: "dsa"
        };
      }
    }

    // Solve specific popular coding questions
    if (q.includes("two sum") || q.includes("twosum")) {
      return {
        text: `### 💡 Problem Solver: Two Sum (LeetCode #1)\n\n**Problem Statement:** Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.\n\n#### 1. Optimal Approach (Hash Map - One Pass)\nWe can trade space for time by using a Hash Map. We store the values we have seen so far. For each element \`x\`, we check if \`target - x\` is already in our map. If yes, we return their indices.\n\n#### 2. Visual Trace (Target = 9)\n\`\`\`\nnums = [2, 7, 11, 15]\nMap: {} \n- Index 0: val = 2. Complement = 9 - 2 = 7. Not in map. Insert {2: 0}.\n- Index 1: val = 7. Complement = 9 - 7 = 2. Found in map! Return [0, 1].\n\`\`\`\n\n#### 3. Code Implementation\n\`\`\`javascript\n// Optimized JavaScript Solution - O(N) Time, O(N) Space\nfunction twoSum(nums, target) {\n    const map = new Map(); // value -> index\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\`\`\`\n\n#### 4. Complexity Analysis\n- **Time Complexity**: \\(O(N)\\) - We traverse the list of \\(N\\) elements only once. Each lookup in the hash table takes \\(O(1)\\) time.\n- **Space Complexity**: \\(O(N)\\) - In the worst case, we store \\(N\\) elements in the map.`,
        category: "dsa"
      };
    }

    if (q.includes("binary search")) {
      return {
        text: `### 🔍 Concept Explainer: Binary Search\n\n**Binary Search** is an efficient algorithm for finding an item from a **sorted** list of items. It works by repeatedly dividing in half the portion of the list that could contain the item.\n\n#### 1. Visual Representation\n\`\`\`\nSorted Array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91] (Target = 23)\n\nStep 1: Low = 0, High = 9, Mid = (0 + 9) / 2 = 4 (value = 16)\n        Since 16 < 23, target must be in the right half. Low = Mid + 1 = 5.\n\nStep 2: Low = 5, High = 9, Mid = (5 + 9) / 2 = 7 (value = 56)\n        Since 56 > 23, target must be in the left half. High = Mid - 1 = 6.\n\nStep 3: Low = 5, High = 6, Mid = (5 + 6) / 2 = 5 (value = 23)\n        Since 23 == 23, target found at Index 5!\n\`\`\`\n\n#### 2. Code Implementation\n\`\`\`cpp\n// C++ Iterative Implementation\n#include <vector>\n\nint binarySearch(const std::vector<int>& arr, int target) {\n    int low = 0;\n    int high = arr.size() - 1;\n    \n    while (low <= high) {\n        // Prevents integer overflow: instead of (low + high) / 2\n        int mid = low + (high - low) / 2;\n        \n        if (arr[mid] == target) {\n            return mid; // Element found\n        } else if (arr[mid] < target) {\n            low = mid + 1; // Search right half\n        } else {\n            high = mid - 1; // Search left half\n        }\n    }\n    return -1; // Element not found\n}\n\`\`\`\n\n#### 3. Complexity Analysis\n- **Time Complexity**: \\(O(\\log N)\\) - Halves search space at every step.\n- **Space Complexity**: \\(O(1)\\) - Uses constant extra space.`,
        category: "dsa"
      };
    }

    if (q.includes("missing number") || q.includes("find missing")) {
      return {
        text: `### 💡 Problem Solver: Find Missing Number\n\n**Problem:** Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return *the only number in the range that is missing from the array*.\n\n#### 1. Mathematical Approach (Sum Formula)\n- Sum of numbers from \`0\` to \`n\` is given by formula: \\(\\frac{n \\times (n + 1)}{2}\\)\n- Sum all numbers in the input array.\n- The difference between the expected sum and the actual sum is the missing number!\n\n#### 2. Code Implementation\n\`\`\`python\n# Python Solution - O(N) Time, O(1) Space\ndef missingNumber(nums):\n    n = len(nums)\n    expected_sum = n * (n + 1) // 2\n    actual_sum = sum(nums)\n    return expected_sum - actual_sum\n\`\`\`\n\n#### 3. Alternative Approach (XOR operation)\nXORing all numbers from \`0\` to \`n\` and all numbers in the array will isolate the missing number, avoiding any potential integer overflow.\n\n- **Time Complexity**: \\(O(N)\\)\n- **Space Complexity**: \\(O(1)\\)`,
        category: "dsa"
      };
    }

    // Default DSA response
    return {
      text: `### 🚀 DSA Training & Practice Center\n\nI can help you solve, understand, and debug any Data Structures and Algorithms questions. Here is a curated syllabus roadmap to practice:\n\n1. **Arrays & Hashing**: Two Sum, Contains Duplicate, Group Anagrams\n2. **Two Pointers & Sliding Window**: Valid Palindrome, Best Time to Buy/Sell Stock\n3. **Stack & Linked Lists**: Valid Parentheses, Reverse Linked List, Merge Sorted Lists\n4. **Trees & Graphs**: Inorder Traversal, Max Depth of Binary Tree, DFS/BFS traversals\n5. **Dynamic Programming**: Climbing Stairs, Coin Change, Longest Common Subsequence\n\n**Try asking:**\n- "Explain Binary Search with code"\n- "Solve the Two Sum problem"\n- "Why is my nested loop in C++ giving Time Limit Exceeded (TLE)?"\n- "Solve missing number in array in Python"`,
      category: "dsa"
    };
  }

  // --- C. SQL & DATABASE MANAGEMENT (DBMS) ---
  if (isSQLQuery) {
    if (q.includes("join")) {
      return {
        text: `### 📊 SQL JOINs Explanation & Query Writer\n\nSQL JOINs are used to combine rows from two or more tables based on a related column between them.\n\n#### 1. Sample Schemas\n**Employees Table:**\n| emp_id | name | dept_id |\n|---|---|---|\n| 1 | Aarav | 10 |\n| 2 | Diya | 20 |\n| 3 | Kabir | NULL |\n\n**Departments Table:**\n| dept_id | dept_name |\n|---|---|\n| 10 | Engineering |\n| 30 | Marketing |\n\n#### 2. The 4 Main Types of JOINs\n- **INNER JOIN**: Returns records that have matching values in both tables.\n- **LEFT (OUTER) JOIN**: Returns all records from the left table, and matched records from the right. Unmatched rows get \`NULL\` values.\n- **RIGHT (OUTER) JOIN**: Returns all records from the right table, and matched records from the left.\n- **FULL JOIN**: Returns all records when there is a match in either left or right table.\n\n#### 3. Code Examples\n\`\`\`sql\n-- 1. INNER JOIN Example: Finds employees with departments\nSELECT e.name, d.dept_name\nFROM Employees e\nINNER JOIN Departments d ON e.dept_id = d.dept_id;\n-- Result: Aarav | Engineering\n\n-- 2. LEFT JOIN Example: Finds all employees, even without departments\nSELECT e.name, d.dept_name\nFROM Employees e\nLEFT JOIN Departments d ON e.dept_id = d.dept_id;\n-- Result: Aarav | Engineering, Diya | NULL, Kabir | NULL\n\`\`\`\n\n**Tip**: Always alias your tables (e.g., \`Employees e\`) to write concise and readable queries!`,
        category: "sql"
      };
    }

    if (q.includes("highest salary") || q.includes("second highest")) {
      return {
        text: `### 💡 SQL Solver: Find N-th Highest Salary\n\nThis is one of the most common SQL interview questions. Here is how you solve it.\n\n#### 1. Schema\n**Employee Table:**\n| id | name | salary |\n|---|---|---|\n| 1 | Amit | 50000 |\n| 2 | Priya | 80000 |\n| 3 | Rahul | 80000 |\n| 4 | Rohit | 70000 |\n\n#### 2. Query for 2nd Highest Salary (Using Subquery)\n\`\`\`sql\nSELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);\n\`\`\`\n\n#### 3. Generic Query for N-th Highest Salary (Using LIMIT & OFFSET)\nThis works in MySQL, PostgreSQL, and SQLite:\n\`\`\`sql\nSELECT DISTINCT salary\nFROM Employee\nORDER BY salary DESC\nLIMIT 1 OFFSET 1; -- For 2nd highest, change OFFSET value (N-1)\n\`\`\`\n\n#### 4. Advanced Query using Window Functions (Dense Rank)\nThis handles duplicate salaries elegantly:\n\`\`\`sql\nWITH SalaryRank AS (\n    SELECT salary,\n           DENSE_RANK() OVER (ORDER BY salary DESC) as rnk\n    FROM Employee\n)\nSELECT DISTINCT salary \nFROM SalaryRank \nWHERE rnk = 2; -- Change '2' to 'N' for N-th highest\n\`\`\`\n- **DENSE_RANK()** ensures that if two employees have the highest salary, they both get rank 1, and the next highest salary is ranked 2.`,
        category: "sql"
      };
    }

    if (q.includes("group by") || q.includes("having") || q.includes("where vs having")) {
      return {
        text: `### 🔍 SQL Concept: GROUP BY & WHERE vs HAVING\n\n- **GROUP BY**: Groups rows that have the same values into summary rows (like "find the number of customers in each country").\n- **WHERE**: Used to filter rows **before** any groupings are made.\n- **HAVING**: Used to filter groups **after** GROUP BY has aggregated rows. You cannot use HAVING without GROUP BY, and you cannot use aggregate functions (\`SUM\`, \`COUNT\`, \`AVG\`) inside a WHERE clause.\n\n#### 1. SQL Query Example\nGet departments where the total department salary exceeds $150,000, filtering out employees earning less than $20,000 first:\n\n\`\`\`sql\nSELECT dept_id, SUM(salary) AS total_dept_salary\nFROM Employee\nWHERE salary >= 20000  -- Filter rows (Individual Employees)\nGROUP BY dept_id       -- Group rows by department\nHAVING SUM(salary) > 150000; -- Filter groups (Departments)\n\`\`\`\n\n#### 2. Debugging SQL Queries\nIf you see this common error:\n> *Column 'Employee.name' is invalid in the select list because it is not contained in either an aggregate function or the GROUP BY clause.*\n\n**Reason**: Any column selected must either be grouped in the \\\`GROUP BY\\\` clause or wrapped in an aggregate function (like \\\`MAX()\\\`, \\\`AVG()\\\`, \\\`COUNT()\\\`). Fix it by adding the column to the group statement or aggregating it.`,
        category: "sql"
      };
    }

    // Default SQL response
    return {
      text: `### 💾 SQL & Database Practice Trainer\n\nI can write, explain, and validate SQL queries for you. Here are the core topics we can practice:\n\n1. **Basic Queries**: SELECT, WHERE, ORDER BY, LIMIT\n2. **Aggregations**: SUM, AVG, COUNT, MIN, MAX with GROUP BY and HAVING\n3. **Subqueries & CTEs**: Correlated subqueries and WITH clauses\n4. **JOIN operations**: INNER, LEFT, RIGHT, FULL OUTER JOIN\n5. **Database Normalization**: 1NF, 2NF, 3NF, BCNF rules\n\n**Try asking:**\n- "Write a query to find the second highest salary"\n- "Explain difference between Left Join and Inner Join"\n- "Write query to count employees per department with average salary"\n- "Explain database normalization with simple tables"`,
      category: "sql"
    };
  }

  // --- D. PLACEMENT PREPARATION & CORE CS ---
  if (isPlacementQuery) {
    if (q.includes("resume")) {
      return {
        text: `### 📄 Premium ATS Resume Guide\n\nMost tech companies use **Applicant Tracking Systems (ATS)** to screen resumes. Here is how to format your resume to get past the filters:\n\n#### 1. Structural Checklist\n- **Layout**: Single-column layout ONLY. Two-column layouts get scrambled by ATS parsers.\n- **Font**: Standard professional fonts (Inter, Arial, Calibri, Times New Roman).\n- **Length**: Strict 1-page limit for college graduates.\n- **Links**: Clickable GitHub, LinkedIn, and Portfolio links. Avoid links in text format.\n- **Sections**: Header (Contact info), Education, Skills (Languages/Tools), Experience/Internships, Projects, Coding Profiles (LeetCode/CodeForces).\n\n#### 2. The STAR Project Bullet Template\nWrite your project bullet points using this framework: **Action + Context + Quantified Result**.\n\n- *Bad*: "Worked on backend development of an e-commerce website."\n- *Good*: "Built REST APIs for e-commerce checkouts using Node.js and Express, implementing Redis caching which **reduced API response latency by 45%** and handled **10,000+ mock monthly requests**."\n\n#### 3. Section Template\n\`\`\`\nPROJECTS\nCareerForge AI | React, Node.js, Tailwind, SQLite\n- Designed and built a placement coaching application using React state routing, reducing user onboarding friction.\n- Engineered custom mock tests and roadmaps, leading to 95% test completion rate in initial trial groups.\n\`\`\``,
        category: "placement"
      };
    }

    if (q.includes("amazon") || q.includes("google") || q.includes("microsoft") || q.includes("tcs") || q.includes("infosys") || q.includes("wipro") || q.includes("company")) {
      let company = "Target Company";
      let details = "";
      if (q.includes("amazon")) {
        company = "Amazon";
        details = `**Amazon SDE Interview Stages:**\n1. **Online Assessment (OA)**: 2 coding questions (Medium-Hard) + Work Style Assessment.\n2. **Technical Rounds (2-3 rounds)**: High focus on DSA (Trees, Graphs, DP) and System Design.\n3. **Bar Raiser Round**: Heavy focus on **Amazon's 16 Leadership Principles**. Prepare stories using the **STAR Method** (Situation, Task, Action, Result) for questions like "Tell me about a time you had a conflict with a teammate."`;
      } else if (q.includes("google")) {
        company = "Google";
        details = `**Google SWE Interview Stages:**\n1. **Screening Round**: 1 coding question (Medium-Hard) on DS/Algorithms.\n2. **Onsite Rounds (3-4 rounds)**: DSA (heavy focus on Graphs, Trees, Recursion, Heaps, and Dynamic Programming) + **Googlyness & Leadership Round** (behavioral and situational questions).\n*Tip: Google evaluates clean code, readability, edge case analysis, and time complexity updates during live coding on Google Docs.*`;
      } else if (q.includes("tcs") || q.includes("infosys") || q.includes("wipro")) {
        company = "Service-Based MNCs (TCS/Infosys/Wipro)";
        details = `**Placement Stages:**\n1. **Aptitude Test**: Quantitative Aptitude, Logical Reasoning, Verbal Ability, and Coding (1-2 basic questions on Arrays/Strings).\n2. **Technical Interview**: Core CS subjects (DBMS, OOPs, OS, SQL commands), basic DSA (bubble sort, Fibonacci, palindrome check), and explanation of final year projects.\n3. **HR Round**: Behavioral check, communication skills, shift adaptability, and salary package alignment.`;
      } else {
        details = `Most tech interviews check **DSA foundations** (first round), **Core CS subjects** (SQL, DBMS, Operating Systems, OOPs), and **Resume Projects** followed by HR behavior checks.`;
      }

      return {
        text: `### 🏢 Company Placement Guide: ${company}\n\nHere is the interview process and preparation tips:\n\n${details}\n\n#### Quick Prep Strategy:\n- Prepare **2 STAR behavioral stories** for each leadership category (ownership, learn/curious, customer obsession).\n- Solve **Top 50 standard LeetCode problems** tagged for the company.\n- Brush up on SQL joins, Operating Systems (Deadlocks/Paging), and OOPs principles (Abstraction, Polymorphism).`,
        category: "placement"
      };
    }

    if (q.includes("deadlock") || q.includes("operating system") || q.includes("osi") || q.includes("network") || q.includes("system design") || q.includes("react") || q.includes("javascript") || q.includes("python") || q.includes("java") || q.includes("c++")) {
      // Core subject explainers
      return {
        text: `### 📚 Core CS Subject Prep: Technical Interviews\n\nHere are concise summaries of standard interview questions in core CS subjects:\n\n#### 1. Operating Systems (OS) - Deadlocks\n- **What is a Deadlock?** A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process.\n- **4 Necessary Conditions (Coffman Conditions):**\n  1. **Mutual Exclusion**: Resource can only be held by one process at a time.\n  2. **Hold and Wait**: Process holding resources can request new resources without releasing current ones.\n  3. **No Preemption**: Resources cannot be forcibly taken from a process.\n  4. **Circular Wait**: Process A waits for B, which waits for C, which waits for A.\n\n#### 2. Computer Networks - OSI Model\n- **7 OSI Layers (Physical to Application):**\n  1. *Physical* (bit streams, cables)\n  2. *Data Link* (MAC address, frames, error detection)\n  3. *Network* (IP address, routing, packets)\n  4. *Transport* (TCP/UDP ports, reliability, segments)\n  5. *Session* (connection maintenance)\n  6. *Presentation* (encryption, data formatting)\n  7. *Application* (HTTP, FTP, SMTP, DNS)\n\n#### 3. OOPs Concepts\n- **Inheritance**: Subclass acquiring properties of parent class.\n- **Polymorphism**: Overloading (compile-time) and Overriding (run-time).\n- **Encapsulation**: Wrapping data variables and methods inside a single class capsule.\n- **Abstraction**: Hiding internal implementation details using interfaces or abstract classes.`,
        category: "placement"
      };
    }

    // Default Placement response
    return {
      text: `### 💼 Placement & Career Prep Guide\n\nI can help you build your resume, map out study schedules, write company guides, or practice technical interview questions. \n\n**Topics we can explore:**\n- **ATS Resume reviews**: "How to format my resume" or "Show me a STAR project bullet template"\n- **Company Interview structures**: "How is the Amazon SDE interview structured?" or "What is TCS NQT test pattern?"\n- **Core CS subjects**: "Explain deadlocks in Operating Systems" or "Explain OSI layers in networks"\n- **Technical Interview questions**: Mock questions for Java/Python/C++/React concepts.\n- **Behavioral interview strategies**: How to apply the STAR framework.`,
      category: "placement"
    };
  }

  // --- E. FALLBACK FOR UNSUPPORTED TOPICS ---
  return {
    text: `👋 **Hi there! I am CareerForge's Dedicated Placement & Training AI Coach.**\n\nI noticed you asked about a topic that seems outside my core areas of training. To ensure you get the absolute best guidance, I specialize strictly in:\n\n1. **College Selection & Placement Advice (Delhi NCR)**: Get rankings, fee structures, eligibility criteria, and ROI comparisons for Noida, Greater Noida, Delhi, Ghaziabad, and Meerut.\n2. **Technical Training Subjects**: In-depth explanations, problem-solving, and error debugging for **Data Structures & Algorithms (DSA)**, **DBMS & SQL**, and programming languages (C++, Java, Python, JS).\n3. **Interview & Placement Prep**: Review resume layouts, check company interview patterns (Google, Amazon, TCS, etc.), and study core CS subjects (Operating Systems, Networks, System Design).\n\n**Try asking me something like:**\n- *"Show me engineering colleges in Greater Noida under 1.8 Lakhs"*\n- *"Write an SQL query to get the second highest salary"*\n- *"Explain Binary Search with pseudocode and time complexity"*\n- *"Give me a STAR bullet template for my software project"*`,
    category: "unsupported"
  };
}
