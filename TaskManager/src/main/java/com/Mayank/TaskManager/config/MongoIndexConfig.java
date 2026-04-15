package com.Mayank.TaskManager.config;

import com.Mayank.TaskManager.model.AuditLog;
import com.Mayank.TaskManager.model.IdempotencyRecord;
import com.Mayank.TaskManager.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.index.IndexResolver;
import org.springframework.data.mongodb.core.index.MongoPersistentEntityIndexResolver;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import jakarta.annotation.PostConstruct;

@Configuration
public class MongoIndexConfig {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private MongoMappingContext mongoMappingContext;

    @PostConstruct
    public void initIndices() {
        IndexOperations indexOps = mongoTemplate.indexOps("tasks");
        indexOps.ensureIndex(new Index().on("userId", Sort.Direction.ASC));
        indexOps.ensureIndex(new Index().on("approvalStatus", Sort.Direction.ASC));
        indexOps.ensureIndex(new Index().on("deleted", Sort.Direction.ASC));
        indexOps.ensureIndex(new Index().on("userId", Sort.Direction.ASC).on("approvalStatus", Sort.Direction.ASC));

        IndexOperations auditIndexOps = mongoTemplate.indexOps("auditLogs");
        auditIndexOps.ensureIndex(new Index().on("taskId", Sort.Direction.ASC));
        auditIndexOps.ensureIndex(new Index().on("userId", Sort.Direction.ASC));
        auditIndexOps.ensureIndex(new Index().on("timestamp", Sort.Direction.DESC));

        IndexOperations idempotencyIndexOps = mongoTemplate.indexOps("idempotencyRecords");
        idempotencyIndexOps.ensureIndex(new Index().on("idempotencyKey", Sort.Direction.ASC).named("unique_idempotencyKey").unique());
        idempotencyIndexOps.ensureIndex(new Index().on("expiresAt", Sort.Direction.ASC));
    }
}
