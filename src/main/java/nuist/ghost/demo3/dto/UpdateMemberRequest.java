package nuist.ghost.demo3.dto;

public record UpdateMemberRequest(
        String name,
        String memberType,
        String phoneNumber,
        String email,
        Boolean isProbation,
        Double interviewScore,
        Double internshipScore,
        Double salaryScore
) {
}
