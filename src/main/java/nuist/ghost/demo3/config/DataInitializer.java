package nuist.ghost.demo3.config;
/**
 * @Author Kai Cai 蔡凯
 * @Description: 用于初始化测试数据的组件，从data/members.json文件中读取成员数据并保存到数据库中
 *               实现CommandLineRunner接口，在应用启动时执行数据初始化逻辑
 *               确保在项目根目录下有data/members.json文件，且格式正确
 */

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
