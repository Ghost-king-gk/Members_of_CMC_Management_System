package nuist.ghost.demo3.service;
/**
 * @Service Layer for managing Member entities.
 * @author  Chuhang Zhang 张初航 for framework
 * @author  Xuyang Zhou 周徐旸 for switch-case structure
 * @description
 */

import nuist.ghost.demo3.dto.CreateMemberRequest;
import nuist.ghost.demo3.dto.UpdateMemberRequest;
import nuist.ghost.demo3.entities.Member;
import nuist.ghost.demo3.entities.President;
import nuist.ghost.demo3.entities.RegularMember;
import nuist.ghost.demo3.entities.SectionHead;
import nuist.ghost.demo3.exception.DuplicateStudentIDException;
import nuist.ghost.demo3.exception.NotFoundException;
import nuist.ghost.demo3.repository.MemberRepository;
import nuist.ghost.demo3.utils.JsonUtils;
import nuist.ghost.demo3.utils.SortUtils;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }


    public Member createMember(Member member) {
        /*创建成员*/
        if (member == null) {
            throw new IllegalArgumentException("member cannot be null.");
        }
        String name = member.getName();
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty.");
        }
        String studentID = member.getStudentID();
        if(studentID == null || studentID.trim().isEmpty() ){
            throw new IllegalArgumentException("StudentID cannot be null or empty.");
        }
        studentID = studentID.trim();
        if(!studentID.matches("\\d{12}")){
            throw new IllegalArgumentException("StudentID must be exactly 12 digits.");
        }
        //在创建成员之前，检查是否已经存在相同学号的成员
        if(memberRepository.existsByStudentID(studentID)){
            throw new DuplicateStudentIDException("Member with studentID " + studentID + " already exists.");
        }
        member.setStudentID(studentID);
        return memberRepository.save(member);
    }

    private Double parseScore(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Double.parseDouble(value.trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(fieldName + " must be a valid number.");
        }
    }

    public Member createMember(CreateMemberRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("request cannot be null.");
        }

        String memberType = request.memberType();
        if (memberType == null || memberType.trim().isEmpty()) {
            throw new IllegalArgumentException("memberType cannot be null or empty.");
        }
        memberType = memberType.trim();

        Member member = switch (memberType) {
            case "RegularMember" -> new RegularMember(request.name(), request.studentID());
            case "SectionHead" -> new SectionHead(request.name(), request.studentID());
            case "President" -> new President(request.name(), request.studentID());
            default -> throw new IllegalArgumentException(
                    "Unsupported memberType: " + memberType + ". Use RegularMember/SectionHead/President."
            );
        };

        if (request.email() != null) member.setEmail(request.email());
        if (request.phoneNumber() != null) member.setPhoneNumber(request.phoneNumber());
        if (request.isProbation() != null) member.setProbation(request.isProbation());
        
        Double interviewScore = parseScore(request.interviewScore(), "Interview Score");
        if (interviewScore != null) {
            if(interviewScore >= 0  &&  interviewScore <= 15) {
                member.setInterviewScore(interviewScore);
            }else throw new IllegalArgumentException("Interview score must be between 0 and 15.");
        }
        
        Double internshipScore = parseScore(request.internshipScore(), "Internship Score");
        if (internshipScore != null) {
            if(internshipScore >=0 && internshipScore <= 20) {
                member.setInternshipScore(internshipScore);
            }else throw new IllegalArgumentException("Internship score must be between 0 and 20.");
        }
        
        Double salaryScore = parseScore(request.salaryScore(), "Salary Score");
        if (salaryScore != null) {
            if(salaryScore >=0 && salaryScore <= 5500) {
                member.setSalaryScore(salaryScore);
            }else throw new IllegalArgumentException("Salary score must be between 0 and 5500.");
        }

        return createMember(member);
    }

    public List<Member> getAllMembers() {
        /*获取所有成员*/
        return memberRepository.findAll();
    }

    public Member getMemberByID(Long id){
        /*通过ID获取成员*/
        return memberRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Member is not existed: id=" + id));
    }

    public Member getMemberByStudentID(String studentID){
        /*通过学号获取成员*/
        return memberRepository.findByStudentID(studentID)
                .orElseThrow(() -> new NotFoundException("Member is not existed: studentID=" + studentID));
    }

    public List<Member> getMembersByName(String name){
        /*通过姓名获取成员*/
        return memberRepository.findByName(name);
    }

    public List<Member> getMembersByIsProbation(boolean isProbation){
        /*通过是否为实习期获取成员*/
        return memberRepository.findByIsProbation(isProbation);
    }

    public List<Member> getMembersByInternshipScoreGreaterThan(double score){
        /*通过实习分获取成员*/
        return memberRepository.findByInternshipScoreGreaterThan(score);
    }

    public List<Member> getMembersByPositon(String position){
        /*通过职位获取成员*/
        return memberRepository.findByMemberType(position);
    }


    public Member updateMember(Long id, UpdateMemberRequest request){
        /*更新成员（业务层统一处理不存在）*/
        Member member = getMemberByID(id);

        if (request == null) {
            throw new IllegalArgumentException("Update request cannot be null.");
        }

        if (request.name() != null && !request.name().trim().isEmpty()) {
            member.setName(request.name().trim());
        }

        if (request.memberType() != null && !request.memberType().trim().isEmpty()) {
            String currentType = member.getMemberType();
            String requestedType = request.memberType().trim();
            if (!requestedType.equals(currentType)) {
                throw new IllegalArgumentException("Changing member type is not supported in update.");
            }
        }

        member.setPhoneNumber(request.phoneNumber());
        member.setEmail(request.email());

        if (request.isProbation() != null) {
            member.setProbation(request.isProbation());
        }

        Double interviewScore = parseScore(request.interviewScore(), "Interview Score");
        if (interviewScore != null) {
            if(interviewScore >= 0  &&  interviewScore <= 15) {
                member.setInterviewScore(interviewScore);
            }else throw new IllegalArgumentException("Interview score must be between 0 and 15.");
        }

        Double internshipScore = parseScore(request.internshipScore(), "Internship Score");
        if (internshipScore != null) {
            if(internshipScore >=0 && internshipScore <= 20) {
                member.setInternshipScore(internshipScore);
            }else throw new IllegalArgumentException("Internship score must be between 0 and 20.");
        }

        Double salaryScore = parseScore(request.salaryScore(), "Salary Score");
        if (salaryScore != null) {
            if(salaryScore >=0 && salaryScore <= 5500) {
                member.setSalaryScore(salaryScore);;
            }else throw new IllegalArgumentException("Salary score must be between 0 and 5500.");
        }

        return memberRepository.save(member);
    }

    public void promoteMember(Long id){
        /*提升成员*/
        Member member = getMemberByID(id);
        String nextType = switch (member.getMemberType()) {
            case "RegularMember" -> "SectionHead";
            case "SectionHead" -> "President";
            case "President" -> throw new IllegalArgumentException("Member is already at highest position: id=" + id);
            default -> throw new IllegalStateException("Unexpected member type: " + member.getMemberType());
        };

        Member promotedMember = recreateWithType(member, nextType);
        replaceMember(id, promotedMember);
    }

    public void demoteMember(Long id) {
        Member member = getMemberByID(id);
        String nextType = switch (member.getMemberType()) {
            case "RegularMember" -> throw new IllegalArgumentException("Member is already at lowest position: id=" + id);
            case "SectionHead" -> "RegularMember";
            case "President" -> "SectionHead";
            default -> throw new IllegalStateException("Unexpected member type: " + member.getMemberType());
        };

        Member demotedMember = recreateWithType(member, nextType);
        replaceMember(id, demotedMember);
    }

    private Member recreateWithType(Member source, String memberType) {
        Member recreated = switch (memberType) {
            case "RegularMember" -> new RegularMember(source.getName(), source.getStudentID());
            case "SectionHead" -> new SectionHead(source.getName(), source.getStudentID());
            case "President" -> new President(source.getName(), source.getStudentID());
            default -> throw new IllegalArgumentException("Unsupported memberType: " + memberType);
        };

        duplicateInfo(recreated, source);
        recreated.setId(source.getId());
        recreated.setJoinDate(source.getJoinDate());
        return recreated;
    }

    private void replaceMember(Long id, Member replacement) {
        memberRepository.deleteById(id);
        memberRepository.save(replacement);
    }

    private void duplicateInfo(Member operatedMember, Member member) {
        operatedMember.setEmail(member.getEmail());
        operatedMember.setPhoneNumber(member.getPhoneNumber());
        operatedMember.setProbation(member.isProbation());
        operatedMember.setInterviewScore(member.getInterviewScore());
        operatedMember.setInternshipScore(member.getInternshipScore());
        operatedMember.setSalaryScore(member.getSalaryScore());
    }

    public void deleteMember(Long id){
        /*删除成员*/
        if (!memberRepository.existsById(id)) {
            throw new NotFoundException("Member is not existed: id=" + id);
        }
        memberRepository.deleteById(id);
    }

    public void deleteAllMembers() {
        memberRepository.deleteAll();
    }


    public void exportMembersToJson() {
        final Path dataPath = Paths.get("data", "members.json");
        try {
            JsonUtils.writeToFile(memberRepository.findAll(), dataPath);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to export members to JSON.", e);
        }
    }

    public void sortMembersByStudentID(List<Member> members) {
        List<Member> sortedMembers = SortUtils.quickSortByID(members);
        memberRepository.deleteAll();
        memberRepository.saveAll(sortedMembers);
        exportMembersToJson();
    }


    public void createSampleData() {
        /*
         * 创建样本数据
         * Built by Ximing Chen
         */
        Member member1 = new RegularMember("张三", "202100100000");
        member1.setInterviewScore(85.0);

        Member member2 = new SectionHead("李四", "202100200000");
        member2.setInternshipScore(90.0);

        Member member3 = new President("王五", "202100300000");
        member3.setSalaryScore(95.0);

        createMember(member1);
        createMember(member2);
        createMember(member3);
        exportMembersToJson();
    }


    public void regularizeMember(Long id) {
        Member member = getMemberByID(id);
        if (member.isProbation()) {
            member.setProbation(false);
            double initSalaryScore = member.getInternshipScore() * 10;
            member.setSalaryScore(initSalaryScore);
            member.setInternshipScore(0);
            memberRepository.save(member);
        } else {
            throw new IllegalArgumentException("Member is not on probation: id=" + id);
        }
    }
}
