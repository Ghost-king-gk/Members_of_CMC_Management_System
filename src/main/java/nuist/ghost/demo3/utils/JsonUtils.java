package nuist.ghost.demo3.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import nuist.ghost.demo3.entities.Member;
import nuist.ghost.demo3.entities.President;
import nuist.ghost.demo3.entities.RegularMember;
import nuist.ghost.demo3.entities.SectionHead;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public final class JsonUtils {
    private static final ObjectMapper MAPPER = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    private JsonUtils() {
        /* no instantiation */
    }

    public static String objectToJson(Object obj) throws JsonProcessingException {
        /**
         * 将对象转为 JSON 字符串   object -> JSON
         */
        return MAPPER.writeValueAsString(obj);
    }

    public static <T> T jsonToObject(String json, Class<T> clazz) throws IOException {
        /**
         * 将 JSON 字符串转为对象   JSON -> object
         */
        return MAPPER.readValue(json, clazz);
    }

    public static <T> T jsonToObject(JsonNode node, Class<T> clazz) {
        /**
         * 将 JsonNode 转为对象   JSON -> object
         */
        return MAPPER.convertValue(node, clazz);
    }

    public static <T> List<T> readListFromPath(Path path, Class<T> elementClass) {
        /**
         * 从指定路径读取 JSON 文件，并转为对象列表   JSON -> List<object>
         */
        List<T> result = new ArrayList<>();
        if (!Files.exists(path)) return result;
        try (InputStream is = Files.newInputStream(path)) {
            JsonNode root = MAPPER.readTree(is);
            if (root != null && root.isArray()) {
                for (JsonNode n : root) {
                    try {
                        result.add(jsonToObject(n, elementClass));
                    } catch (Exception e) {
                        // 单条反序列化异常忽略，继续下一条
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return result;
    }

    public static List<Member> readMembersFromPath(Path path) {
        /**
         * 从指定路径读取 JSON 文件，并转为 Member 对象列表   JSON -> List<Member>
         */
        List<Member> loaded = new ArrayList<>();
        if (!Files.exists(path)) return loaded;
        try (InputStream is = Files.newInputStream(path)) {
            JsonNode root = MAPPER.readTree(is);
            if (root != null && root.isArray()) {
                for (JsonNode node : root) {
                    Member m = convertNodeToMember(node);
                    if (m != null) loaded.add(m);
                }
            }
        } catch (Exception ignored) {


        }
        return loaded;
    }

    public static List<Member> readMembersFromDefaultLocation() {
        /**
         * 读取默认位置的 JSON 文件，并转为 Member 列表   JSON -> List<Member>
         * Default: data/members.json
         */
        return readMembersFromPath(Paths.get("data", "members.json"));
    }

    public static void writeToFile(Object obj, Path path) throws IOException {
        /**
         * 将对象写入指定路径的 JSON 文件   object -> JSON
         */
        if (path.getParent() != null) {
            Files.createDirectories(path.getParent());
        }
        String json = objectToJson(obj);
        Files.writeString(path, json);
    }

    private static Member convertNodeToMember(JsonNode node) {
        try {
            JsonNode typeNode = node.get("memberType");
            if (typeNode == null || typeNode.isNull()) {
                return MAPPER.convertValue(node, Member.class);
            }
            String type = typeNode.asText("");
            return switch (type) {
                case "President" -> jsonToObject(node, President.class);
                case "SectionHead" -> jsonToObject(node, SectionHead.class);
                case "RegularMember" -> jsonToObject(node, RegularMember.class);
                default -> jsonToObject(node, Member.class);
            };
        }catch (Exception ex){
            // 现在最好记录异常以便排查（这里简短返回 null 保持原行为）
            return null;
        }

    }
}

