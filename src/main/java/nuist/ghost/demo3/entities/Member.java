package nuist.ghost.demo3.entities;


import lombok.Getter;
import lombok.Setter;
import nuist.ghost.demo3.utils.TimeUtils;

@Getter
@Setter
public abstract class Member {
    private Long id;
    private String name;
    private String studentID;
    private boolean isProbation;//是否为实习期
    private String email;
    private String phoneNumber;
    private double interviewScore;//面试分
    private double internshipScore;//实习分
    private double salaryScore; //工分
    private String joinDate;


    protected Member() {
        this.isProbation = true;
        // 默认构造函数
        this.joinDate = TimeUtils.currentTimestamp();
    }


    public Member(String name, String studentID) {
        this.name = name;
        this.studentID = studentID;
        this.isProbation = true;
        this.joinDate = TimeUtils.currentTimestamp();
    }


    public abstract String getMemberType();


    public String getInfo() {
        return String.format(
                """
                        姓名：%s
                        学号：%s
                        是否为实习期：%s
                        邮箱：%s
                        电话：%s
                        面试分：%.2f
                        实习分：%.2f
                        工分：%.2f
                        职位：%s""",
                name, studentID, isProbation, email, phoneNumber, interviewScore, internshipScore, salaryScore, getMemberType()
        );
    }

    @Override
    public String toString() {
        return String.format(
                "Member[id=%d, name='%s', studentID='%s', type='%s']",
                id, name, studentID, getMemberType()
        );
    }
}
