package nuist.ghost.demo3.dto;
/**
 * @author Chuhang Zhang 张初航
 * @author Ximing Chen 陈玺名
 * @description 更新成员数据传输对象
 * A new feature after java 17:  Record
 * A naive trial. I need more practice and learning to master it.
 */

public record UpdateMemberRequest(
        String name,
        String memberType,
        String phoneNumber,
        String email,
        Boolean isProbation,
        String interviewScore,
        String internshipScore,
        String salaryScore
) {
}
