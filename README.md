# Members of CMC Management System / CMC 成员管理系统

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## 🇬🇧 English

### Introduction
**Members of CMC Management System** is a comprehensive web application designed to manage member information for the CMC organization. It provides a streamlined interface for administrators to track member details, manage recruitment scores, handle promotions/demotions, and visualize member status.

### Technical Features

#### Backend (Java / Spring Boot)
-   **Framework**: Built on **Spring Boot 3.5.7** and **Java 21**, utilizing modern Java features (Records, Switch Expressions).
-   **Architecture**: Follows a clean layered architecture (Controller, Service, Repository, Entities, DTOs).
-   **Data Persistence**: Implements a custom JSON-based persistence layer (`members.json`) for lightweight data storage without requiring an external database.
-   **Validation**: Robust server-side validation logic ensuring data integrity (e.g., score ranges, unique Student IDs).
-   **RESTful API**: Exposes a clear API for frontend interaction.

#### Frontend (HTML / CSS / JavaScript)
-   **Architecture**: Modular Vanilla JavaScript architecture (`app.js`, `ui.js`, `api.js`) separating concerns between logic, rendering, and data fetching.
-   **UI/UX**:
    -   Responsive design with custom CSS animations (e.g., shake effects for validation errors).
    -   Interactive forms with real-time feedback.
    -   Dynamic filtering and searching capabilities (by Name, ID, Position, Score).
-   **Features**:
    -   **Member Lifecycle**: Support for "Regularization" (promoting interns to official members).
    -   **Visual Feedback**: "Red bouncing box" error highlighting for intuitive user guidance.

### Core Mechanisms

#### Member Hierarchy & Lifecycle
The system implements a strict hierarchical logic for member management:

1.  **Role Hierarchy**:
    -   **Regular Member**: The base role for all members.
    -   **Section Head**: Promoted from Regular Member.
    -   **President**: The highest leadership role.
    -   *Promotion/Demotion*: Members can be promoted or demoted step-by-step through this hierarchy (e.g., Regular Member ↔ Section Head ↔ President).

2.  **Probation & Regularization**:
    -   **Intern (Probation)**: New members start as interns. They are evaluated based on their **Internship Score**.
    -   **Regularization Process**: When an intern is regularized:
        -   Status changes to **Official**.
        -   **Salary Score** is initialized as `Internship Score * 10`.
        -   **Internship Score** is reset to 0.

3.  **Scoring System**:
    -   **Interview Score (0-15)**: Assessed upon entry.
    -   **Internship Score (0-20)**: Used to evaluate interns during the probation period.
    -   **Salary Score (0-5500)**: The primary metric for official members ("Gongfen").

---

<a name="chinese"></a>
## 🇨🇳 中文

### 项目简介
**CMC 成员管理系统 (Members of CMC Management System)** 是一个用于管理 CMC 组织成员信息的全栈 Web 应用程序。它为管理员提供了一个高效的界面，用于追踪成员详情、管理考核分数、处理职位升降级以及可视化成员状态。

### 技术特点

#### 后端 (Java / Spring Boot)
-   **框架**: 基于 **Spring Boot 3.5.7** 和 **Java 21** 构建，使用了 Java 的现代特性（如 Records, Switch 表达式）。
-   **架构**: 遵循清晰的分层架构设计 (Controller, Service, Repository, Entities, DTOs)。
-   **数据持久化**: 实现了基于 JSON 文件 (`members.json`) 的自定义持久层，无需外部数据库即可轻量级存储数据。
-   **数据校验**: 健壮的服务端校验逻辑，确保数据完整性（例如：分数范围检查、学号唯一性校验）。
-   **RESTful API**: 提供清晰的 API 接口供前端调用。

#### 前端 (HTML / CSS / JavaScript)
-   **架构**: 模块化的原生 JavaScript 架构 (`app.js`, `ui.js`, `api.js`)，实现了逻辑、渲染和数据请求的分离。
-   **UI/UX**:
    -   响应式设计，包含自定义 CSS 动画（例如：输入错误的震动提示）。
    -   具有实时反馈的交互式表单。
    -   动态筛选和搜索功能（支持按姓名、ID、职位、分数筛选）。
-   **功能特性**:
    -   **成员生命周期管理**: 支持“转正”功能（将实习成员提升为正式成员）。
    -   **视觉反馈**: 实现了“红色弹跳框”错误高亮机制，提供直观的用户引导。

### 核心机制详解

#### 成员层级与生命周期
本系统实现了一套严谨的成员管理层级逻辑：

1.  **职位层级体系**:
    -   **普通成员 (Regular Member)**: 基础成员角色。
    -   **部长 (Section Head)**: 由普通成员晋升而来。
    -   **社长 (President)**: 最高领导角色。
    -   *升降级机制*: 成员只能逐级晋升或降级（例如：普通成员 ↔ 部长 ↔ 社长），不支持跨级变动。

2.  **实习与转正机制**:
    -   **实习期 (Intern)**: 新成员默认处于实习期，主要考核 **实习分 (Internship Score)**。
    -   **转正流程 (Regularization)**: 当实习成员转正时：
        -   状态变更为 **正式成员 (Official)**。
        -   **工分 (Salary Score)** 初始化为 `实习分 * 10`。
        -   **实习分** 重置为 0。

3.  **评分体系**:
    -   **面试分 (0-15)**: 入部时的初始评分。
    -   **实习分 (0-20)**: 实习期间的考核指标。
    -   **工分 (0-5500)**: 正式成员的主要贡献度量指标。

---

*Developed by nuist.ghost team.*
