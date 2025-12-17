package nuist.ghost.demo3.config;


import nuist.ghost.demo3.entities.Member;
import nuist.ghost.demo3.repository.MemberRepository;
import nuist.ghost.demo3.utils.JsonUtils;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    private final MemberRepository memberRepository;
    final Path DATAPATH = Paths.get("data", "members.json");

    public DataInitializer(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("开始初始化测试数据...");
        //定义数据文件路径 在根目录下的data目录下members.json

        if (!Files.exists(DATAPATH)) {
            System.out.println("数据文件不存在，请检查路径！");
            return;
        }
        List<Member> members = JsonUtils.readMembersFromPath(DATAPATH);
        memberRepository.saveAll(members);

        System.out.println("数据初始化完成！");
    }
}
