package nuist.ghost.demo3.dto;

public record CreateMemberRequest(
        String name,
        String studentID,
        String memberType,
        String email,
        String phoneNumber,
        Boolean isProbation,
        Double interviewScore,
        Double internshipScore,
        Double salaryScore
) {
}
//dto: data transfer object

//用于创建成员请求的数据传输对象
//包含成员的基本信息和可选属性
//使用record简化代码，自动生成构造函数和访问方法

//字段包括姓名、学号、成员类型、电子邮件、电话号码、是否为试用期成员以及各类评分
//该类在服务层用于接收创建成员的请求数据
//并传递给相应的业务逻辑进行处理
//确保数据的完整性和有效性
//方便在不同层之间传递成员信息
//符合面向对象设计原则，提升代码的可维护性和可读性
//适用于基于Spring框架的应用程序
//有助于实现清晰的分层架构
//促进模块化开发
//简化数据处理流程
//提高开发效率
//增强系统的可扩展性和灵活性
//便于后续功能的扩展和维护

