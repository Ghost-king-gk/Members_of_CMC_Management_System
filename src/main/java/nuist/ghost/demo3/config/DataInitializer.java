package nuist.ghost.demo3.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import nuist.ghost.demo3.entities.Member;
import nuist.ghost.demo3.entities.President;
import nuist.ghost.demo3.entities.RegularMember;
import nuist.ghost.demo3.entities.SectionHead;
import nuist.ghost.demo3.repository.MemberRepository;
import nuist.ghost.demo3.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    private final MemberRepository memberRepository;

    public DataInitializer(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("开始初始化测试数据...");
        //定义数据文件路径 在根目录下的data目录下members.json
        final Path DATAPATH = Paths.get("data", "members.json");


        if (!Files.exists(DATAPATH)) {
            System.out.println("数据文件不存在，请检查路径！");
            return;
        }
        List<Member> members = JsonUtils.readMembersFromPath(DATAPATH);
        System.out.println(members);
        memberRepository.saveAll(members);
        System.out.println(memberRepository.findAll());

//        RegularMember regularMember = new RegularMember("张三", "2021001");
//        regularMember.setInterviewScore(85.0);
//
//        SectionHead sectionHead = new SectionHead("李四", "2021002");
//        sectionHead.setInternshipScore(90.0);
//
//        President president = new President("王五", "2021003");
//        president.setSalaryScore(95.0);
//
//        memberRepository.save(regularMember);
//        memberRepository.save(sectionHead);
//        memberRepository.save(president);
//
//        System.out.println("测试数据初始化完成！");
//        System.out.println("创建了 " + memberRepository.count() + " 个成员");
//
//        JsonUtils.writeToFile(memberRepository.findAll(), DATAPATH);
    }
}
